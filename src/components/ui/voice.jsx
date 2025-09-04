import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

const VoiceConversation = ({ onConversationEnd }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [humanHasSpoken, setHumanHasSpoken] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const audioRef = useRef(null);
  const recordingRef = useRef(null);
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const currentAudioUrlRef = useRef(null);
  const lastTurnRef = useRef(null);
  const conversationEndedRef = useRef(false);

  // API configuration
  const FASTAPI_URL = 'http://localhost:8000'; // Adjust if needed

  // Helper function to play audio with proper cleanup
  const playAudioResponse = (audioResponse) => {
    // Clean up previous audio URL if it exists
    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
      currentAudioUrlRef.current = null;
    }

    if (audioResponse && audioRef.current) {
      // Convert base64 to binary data
      const binaryString = atob(audioResponse);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const responseAudioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(responseAudioBlob);
      
      // Store the current audio URL for cleanup
      currentAudioUrlRef.current = audioUrl;
      
      // Set source and play
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      setIsTranscribing(false); // Stop transcribing when AI starts speaking
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      // Clean up audio URL
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
      }
    };
  }, []);

  // Note: Voice activity detection is now handled by AssemblyAI realtime transcription

  const floatTo16BitPCM = (float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  };


  const startConversation = async () => {
    console.log('🚀 Starting voice conversation with realtime transcription...');
    try {
      // First, get the ephemeral token from our backend
      console.log('🔑 Fetching AssemblyAI token...');
      const tokenResponse = await fetch(`${FASTAPI_URL}/get-assemblyai-token`);
      if (!tokenResponse.ok) {
        throw new Error(`Failed to get token: ${tokenResponse.status}`);
      }
      const { token } = await tokenResponse.json();
      console.log('✅ Token received');

      // Create WebSocket connection using AssemblyAI v3 API with token
      const params = {
        sample_rate: 16000,
        format_turns: true,
        token: token
      };
      
      const queryString = new URLSearchParams(params).toString();
      const url = `wss://streaming.assemblyai.com/v3/ws?${queryString}`;
      
      console.log('🔗 Connecting to AssemblyAI WebSocket...');
      console.log('🔗 WebSocket URL:', url);
      console.log('🔗 Token (first 8 chars):', token.substring(0, 8));
      const ws = new WebSocket(url);

      wsRef.current = ws;
      
      // Set up connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.error('❌ WebSocket connection timeout');
          ws.close();
          alert('Connection timeout. Please check your internet connection and try again.');
        }
      }, 10000); // 10 second timeout

      // Set up WebSocket event handlers
      ws.onopen = () => {
        console.log('🎤 AssemblyAI WebSocket connected');
        clearTimeout(connectionTimeout); // Clear the connection timeout
        // Don't set isTranscribing to true here - wait for user to actually speak
        
        // Wait a moment before starting audio stream to ensure connection is stable
        setTimeout(() => {
          console.log('🎵 WebSocket connection stable, ready for audio');
        }, 100);
      };

      ws.onmessage = (event) => {
        try {
          // Log raw data for debugging
          console.log('📨 Raw WebSocket data received:', {
            type: typeof event.data,
            length: event.data ? event.data.length : 0,
            data: event.data
          });
          
          // Handle empty or non-JSON responses
          if (!event.data || event.data.trim() === '') {
            console.log('📨 Received empty message, ignoring...');
            return;
          }
          
          // Check if data is already an object (sometimes WebSocket libraries parse automatically)
          let data;
          if (typeof event.data === 'object') {
            data = event.data;
            console.log('📨 Received object data:', data);
          } else {
            data = JSON.parse(event.data);
            console.log('📨 Parsed JSON data:', data);
          }
          
          // Handle v3 API message format - Process only formatted + dedup by turn order = safest
          if (
            data.type === 'Turn' &&
            data.transcript &&
            data.end_of_turn &&
            data.turn_is_formatted &&
            data.turn_order !== lastTurnRef.current
          ) {
            lastTurnRef.current = data.turn_order;
            console.log('📝 Final transcribed text:', data.transcript);
            setTranscribedText(data.transcript);
            setIsTranscribing(false); // Stop transcribing when turn ends
            processTranscribedText(data.transcript);
          } else if (data.type === 'Turn' && data.transcript && !data.end_of_turn) {
            // Show partial transcripts and start transcribing indicator
            console.log('📝 Partial transcript:', data.transcript);
            setIsTranscribing(true); // Start transcribing when user speaks
          } else if (data.type === 'Begin') {
            console.log('🎯 Session started:', data.id);
            console.log('🎵 Starting audio stream...');
          } else if (data.type === 'Termination') {
            console.log('🔚 Session terminated');
          } else if (data.type === 'Error') {
            console.error('❌ AssemblyAI error:', data.error);
          } else {
            console.log('📨 Unknown message type:', data.type, data);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
          console.log('📨 Raw message data:', event.data);
          console.log('📨 Data type:', typeof event.data);
          console.log('📨 Data length:', event.data ? event.data.length : 'null');
          
          // Try to handle as text if JSON parsing fails
          if (typeof event.data === 'string') {
            console.log('📨 Attempting to handle as plain text:', event.data);
          }
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        clearTimeout(connectionTimeout); // Clear the connection timeout
        setIsTranscribing(false);
        setConversationActive(false);
        alert('WebSocket connection error. Please try again.');
      };

      ws.onclose = (event) => {
        console.log('🔒 WebSocket connection closed', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        clearTimeout(connectionTimeout); // Clear the connection timeout
        setIsTranscribing(false);
        
        // Handle specific error codes
        if (event.code === 3005) {
          console.error('❌ Invalid JSON error - likely audio encoding issue');
          console.error('❌ This usually means the audio data format is incorrect');
          alert('Audio encoding error. Please try again.');
        } else if (event.code === 1006) {
          console.error('❌ Connection closed abnormally');
          alert('Connection lost. Please try again.');
        } else if (!event.wasClean && event.code !== 1000) {
          console.error('❌ Connection closed with error code:', event.code);
          alert(`Connection error (${event.code}). Please try again.`);
        }
      };

      // Get microphone access
      console.log('🎤 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      console.log('✅ Microphone access granted');

      // Set up Web Audio API
      console.log('🔊 Setting up audio context...');
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      console.log('✅ Audio context created, sample rate:', audioContext.sampleRate);
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioContext.destination);
      console.log('✅ Audio processing pipeline connected');

      processor.onaudioprocess = (e) => {
        // Don't send audio data when AI is speaking to avoid interference
        if (ws.readyState === WebSocket.OPEN && !isPlaying) {
          const inputData = e.inputBuffer.getChannelData(0); // Float32Array
          const pcm16 = floatTo16BitPCM(inputData);
          
          // Send raw PCM 16-bit little-endian bytes directly (no JSON, no base64)
          try {
            ws.send(pcm16);
            
            // Debug: Log first few audio sends
            if (Math.random() < 0.01) { // Log ~1% of audio sends to avoid spam
              console.log('🎵 Sending raw PCM audio data, WebSocket state:', ws.readyState);
              console.log('🎵 PCM16 buffer size:', pcm16.byteLength);
            }
          } catch (error) {
            console.error('❌ Error sending audio data:', error);
          }
        } else if (isPlaying) {
          // Debug: Log when we're skipping audio sends due to AI speaking
          if (Math.random() < 0.01) { // Log ~1% of skipped sends to avoid spam
            console.log('🔇 Skipping audio send - AI is speaking');
          }
        } else {
          console.log('⚠️ WebSocket not open, state:', ws.readyState);
        }
      };

      console.log('✅ Setting conversation state - active: true');
      setConversationActive(true);
      conversationEndedRef.current = false; // Reset conversation ended flag
      
      // Make initial call with empty payload so AI talks first
      console.log('🤖 Making initial call to AI...');
      await makeInitialCall();
      
      console.log('✅ Voice conversation setup complete');
      
    } catch (error) {
      console.error('❌ Error starting conversation:', error);
      alert('Could not start conversation. Please check your microphone and internet connection.');
    }
  };

  const makeInitialCall = async () => {
    setIsProcessing(true);
    
    try {
      // Send empty text to trigger AI-first interaction
      const response = await fetch(`${FASTAPI_URL}/audio-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: ''
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get conversation status from response
      const conversationEnded = data.conversation_ended || false;
      const history = data.conversation_history || [];
      
      if (history.length > 0) {
          setConversationHistory(history);
      }
      
      // Get audio response (now base64 encoded)
      if (data.audio_response) {
        playAudioResponse(data.audio_response);
      }
      
      // If conversation ended, mark it but don't end immediately
      if (conversationEnded) {
        conversationEndedRef.current = true;
        // Don't call endConversation() here - let the audio finish first
      }
      
    } catch (error) {
      console.error('❌ Error making initial call:', error);
      alert('Error making initial call. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Voice activity detection removed - now handled by AssemblyAI realtime transcription

  // Old recording functions removed - now using AssemblyAI realtime transcription

  const processTranscribedText = async (transcript) => {
    setIsProcessing(true);
    
    // Mark that human has spoken
    setHumanHasSpoken(true);
    
    try {
      console.log('📝 Processing transcribed text:', transcript);
      
      const response = await fetch(`${FASTAPI_URL}/audio-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: transcript
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get conversation status from response
      const conversationEnded = data.conversation_ended || false;
      const history = data.conversation_history || [];
      
      if (history.length > 0) {
          setConversationHistory(history);
      }
      
      // Get audio response (now base64 encoded)
      if (data.audio_response) {
        playAudioResponse(data.audio_response);
      }
      
      // If conversation ended, mark it but don't end immediately
      if (conversationEnded) {
        conversationEndedRef.current = true;
        // Don't call endConversation() here - let the audio finish first
      }
      
    } catch (error) {
      console.error('❌ Error processing transcribed text:', error);
      alert('Error processing transcribed text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const endConversation = async () => {
    setConversationActive(false);
    setIsTranscribing(false);
    
    // Terminate WebSocket session properly
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Send termination message
      wsRef.current.send(JSON.stringify({ type: 'Terminate' }));
      wsRef.current.close();
    }
    
    // Disconnect audio processor
    if (processorRef.current) {
      processorRef.current.disconnect();
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    // Create conversation summary using OpenAI
    const summary = await generateConversationSummary(conversationHistory);
    
    // Create new conversation entry
    const newConversation = {
      id: `C-${Date.now()}`,
      caller_name: "John Smith",
      caller_phone: "+971 XX XXX XXXX",
      language: "EN",
      service_type: "Owner Acquisition",
      property: "Pagani Tower",
      location: "Dubai",
      vip_score: 85,
      sentiment: "positive",
      outcome: "High Priority",
      duration_sec: Math.floor(Math.random() * 300) + 120, // Random duration
      agent_name: "Nerolia Voice",
      audio_url: null,
      transcript: conversationHistory.join('\n'),
      summary: summary,
      tags: ["owner", "acquisition", "high-priority"],
      started_at: new Date().toISOString()
    };
    
    // Call parent callback with new conversation
    if (onConversationEnd) {
      onConversationEnd(newConversation);
    }
    
    // Reset state
    setConversationHistory([]);
    setHumanHasSpoken(false);
    setTranscribedText('');
  };

  const generateConversationSummary = async (history) => {
    try {
      // Extract the conversation text from history
      const conversationText = history.join('\n');
      
      // Call OpenAI API for summarization
      const response = await fetch(`${FASTAPI_URL}/summarize-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: conversationText
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.summary || "Conversation summary unavailable.";
      
    } catch (error) {
      console.error('Error generating summary:', error);
      // Fallback to a basic summary if API fails
      const hasOwnerMention = history.some(entry => 
        entry.toLowerCase().includes('owner') || 
        entry.toLowerCase().includes('property') ||
        entry.toLowerCase().includes('acquisition')
      );
      
      if (hasOwnerMention) {
        return "Property owner interested in acquisition services. Discussed property details, licensing requirements, and potential yield. High priority lead with strong interest in proceeding.";
      } else {
        return "Conversation completed. Details discussed regarding property services and requirements.";
      }
    }
  };



  return (
    <div className="space-y-4">
      {/* Hidden audio element for seamless playback */}
      <audio 
        ref={audioRef}
        onEnded={() => {
          console.log('🔊 AI audio playback ended');
          setIsPlaying(false);
          
          // Small delay to ensure clean transition before resuming listening
          setTimeout(() => {
            console.log('🎤 Ready to listen again after AI finished speaking');
          }, 100);
          
          // Check if conversation should end after audio finishes
          if (conversationEndedRef.current) {
            console.log('🔚 Conversation marked as ended, finalizing now...');
            endConversation();
          }
        }}
        onPlay={() => {
          console.log('🔊 AI audio playback started');
          setIsPlaying(true);
        }}
        onPause={() => {
          console.log('🔊 AI audio playback paused');
          setIsPlaying(false);
        }}
        style={{ display: 'none' }}
      />
      
      {/* Voice Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!conversationActive ? (
              <Button 
                onClick={startConversation}
                className="bg-green-600 hover:bg-green-700"
                disabled={isProcessing}
              >
                <Phone className="w-4 h-4 mr-2" />
                Start Conversation
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">
                  {isPlaying ? "AI Speaking..." : isTranscribing ? "Listening..." : isProcessing ? "Processing..." : "Ready to Listen"}
                </div>
                
                <Button 
                  onClick={endConversation}
                  variant="outline"
                  disabled={isProcessing}
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Call
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isTranscribing && (
              <Badge variant="default" className="animate-pulse">
                <Mic className="w-3 h-3 mr-1" />
                Transcribing
              </Badge>
            )}
            {isPlaying && (
              <Badge variant="secondary">
                AI Speaking
              </Badge>
            )}
            {isProcessing && (
              <Badge variant="secondary">
                Processing...
              </Badge>
            )}
            {conversationActive && !isTranscribing && !isPlaying && !isProcessing && (
              <Badge variant="outline">
                Connected
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Transcribed Text Display */}
      {conversationActive && transcribedText && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Latest Transcription:</div>
            <div className="text-sm bg-gray-50 p-3 rounded-md border">
              {transcribedText}
            </div>
          </div>
        </Card>
      )}

    </div>
  );
};

export default VoiceConversation;
