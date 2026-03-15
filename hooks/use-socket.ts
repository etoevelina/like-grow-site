'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Avatar } from '@/lib/avatar-api';

import { API_BASE } from '@/lib/api-config';

/** Backend expects token in query string (?token=JWT). */
export interface ContentSubmitResult {
  ok: boolean;
  xp?: number;
  coins?: number;
  avatar?: Avatar;
  leveled_up?: boolean;
  old_level?: number;
  new_level?: number;
  evolution?: {
    image_url: string;
    video_url: string;
  };
  content_evolution?: {
    image_url: string;
    video_url: string;
  };
  error?: string;
}

export interface SocketState {
  isConnected: boolean;
  isSubmitting: boolean;
  lastError: string | null;
}

export function useSocket(
  onAvatarUpdate?: (avatar: Avatar) => void,
  onContentResult?: (result: ContentSubmitResult) => void
) {
  const [state, setState] = useState<SocketState>({
    isConnected: false,
    isSubmitting: false,
    lastError: null,
  });
  
  const socketRef = useRef<Socket | null>(null);
  const onAvatarUpdateRef = useRef(onAvatarUpdate);
  const onContentResultRef = useRef(onContentResult);
  
  // Keep the callback refs updated
  useEffect(() => {
    onAvatarUpdateRef.current = onAvatarUpdate;
  }, [onAvatarUpdate]);
  
  useEffect(() => {
    onContentResultRef.current = onContentResult;
  }, [onContentResult]);

  // Connect to socket
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (!token) {
      return;
    }

    const socket = io(API_BASE, {
      query: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setState(prev => ({ ...prev, isConnected: true, lastError: null }));
    });

    socket.on('disconnect', () => {
      setState(prev => ({ ...prev, isConnected: false }));
    });

    socket.on('connect_error', (error) => {
      setState(prev => ({ ...prev, lastError: error.message }));
    });

    // Avatar updated event - real-time updates
    socket.on('avatar_updated', (payload: { avatar: Avatar }) => {
      if (onAvatarUpdateRef.current && payload.avatar) {
        onAvatarUpdateRef.current(payload.avatar);
      }
    });

    // Content submission events
    socket.on('content_submit_started', () => {
      setState(prev => ({ ...prev, isSubmitting: true, lastError: null }));
    });

    socket.on('content_submit_result', (payload: ContentSubmitResult) => {
      setState(prev => ({ ...prev, isSubmitting: false }));
      
      if (payload.ok && payload.avatar && onAvatarUpdateRef.current) {
        onAvatarUpdateRef.current(payload.avatar);
      }
      
      // Notify about the result
      if (onContentResultRef.current) {
        onContentResultRef.current(payload);
      }
    });

    socket.on('submit_error', (payload: { error: string }) => {
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        lastError: payload.error 
      }));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Submit post via socket
  const submitPost = useCallback((url: string): Promise<ContentSubmitResult> => {
    return new Promise((resolve, reject) => {
      const socket = socketRef.current;
      
      if (!socket || !socket.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      setState(prev => ({ ...prev, isSubmitting: true, lastError: null }));

      // Set up one-time listeners for this submission
      const onResult = (payload: ContentSubmitResult) => {
        socket.off('content_submit_result', onResult);
        socket.off('submit_error', onError);
        
        setState(prev => ({ ...prev, isSubmitting: false }));
        
        if (payload.ok) {
          resolve(payload);
        } else {
          reject(new Error(payload.error || 'Submission failed'));
        }
      };

      const onError = (payload: { error: string }) => {
        socket.off('content_submit_result', onResult);
        socket.off('submit_error', onError);
        
        setState(prev => ({ 
          ...prev, 
          isSubmitting: false, 
          lastError: payload.error 
        }));
        
        reject(new Error(payload.error));
      };

      socket.on('content_submit_result', onResult);
      socket.on('submit_error', onError);

      // Emit the post submission
      socket.emit('submit_post', { url });
    });
  }, []);

  // Disconnect socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  return {
    ...state,
    submitPost,
    disconnect,
    socket: socketRef.current,
  };
}
