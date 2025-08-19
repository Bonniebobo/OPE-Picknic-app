import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

interface MoodMatchScreenProps {
  onBack: () => void;
}

const WEB_CONSOLE_URL = 'https://live-api-web-console-https-webview.vercel.app/';

export default function MoodMatchScreen({ onBack }: MoodMatchScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoadStart = () => {
    console.log('WebView load start:', WEB_CONSOLE_URL);
    setIsLoading(true);
    setHasError(false);
    setErrorDetails('');
  };

  const handleLoadEnd = () => {
    console.log('WebView load end - success');
    setIsLoading(false);
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('🔊 WebView message received:', data);
      
      if (data.type === 'LOGIN_SUCCESS') {
        console.log('🔊 User logged in successfully');
        setIsLoggedIn(true);
      } else if (data.type === 'AI_RESPONSE') {
        console.log('🔊 AI response received:', data);
      } else if (data.type === 'AUDIO_DATA') {
        console.log('🔊 Audio data received from WebView');
      } else if (data.type === 'MIC_BUTTON_CLICKED') {
        console.log('🔊 Microphone button clicked in WebView');
      } else if (data.type === 'AUDIO_ELEMENT_DETECTED') {
        console.log('🔊 Audio element detected in WebView:', data);
      } else if (data.type === 'AUDIO_CONTEXT_RESUMED') {
        console.log('🔊 AudioContext resumed in WebView');
      } else if (data.type === 'AUDIO_PLAYING') {
        console.log('🔊 Audio started playing in WebView');
      } else if (data.type === 'AUDIO_PLAY_ERROR') {
        console.error('🔊 Audio play error in WebView:', data.error);
      } else if (data.type === 'AUDIO_PLAY_EVENT') {
        console.log('🔊 Audio play event detected in WebView');
      } else if (data.type === 'AUDIO_ERROR_EVENT') {
        console.error('🔊 Audio error event in WebView:', data.error);
      } else if (data.type === 'AUDIO_CONTEXT_RESUME_CALLED') {
        console.log('🔊 AudioContext.resume() called in WebView');
      } else if (data.type === 'AUDIO_ELEMENT_CREATED') {
        console.log('🔊 <audio> element created in WebView');
      } else if (data.type === 'AUDIO_PLAY_CALLED') {
        console.log('🔊 audio.play() called in WebView');
      } else if (data.type === 'WEBSOCKET_AUDIO_DETECTED') {
        console.log('🔊 WebSocket audio data detected in WebView, parts:', data.partsCount);
      } else if (data.type === 'AI_AUDIO_PLAYING') {
        console.log('🔊 AI audio started playing in WebView, audioId:', data.audioId);
      } else if (data.type === 'AI_AUDIO_PLAY_ERROR') {
        console.error('🔊 AI audio play error in WebView:', data.error);
      } else {
        console.log('🔊 Unknown WebView message type:', data.type);
      }
    } catch (error) {
      console.log('🔊 WebView message (non-JSON):', event.nativeEvent.data);
    }
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView error details:', nativeEvent);
    
    // 临时弹窗显示详细错误信息
    Alert.alert(
      'WebView Error',
      `Code: ${nativeEvent.code}\nDescription: ${nativeEvent.description}\nURL: ${nativeEvent.url}\nDomain: ${nativeEvent.domain}`,
      [{ text: 'OK' }]
    );
    
    setErrorDetails(JSON.stringify(nativeEvent, null, 2));
    setIsLoading(false);
    setHasError(true);
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView HTTP error:', nativeEvent);
    
    // 对于 401 错误，尝试继续加载而不是显示错误页面
    if (nativeEvent.statusCode === 401) {
      console.log('401 error detected, but continuing to load...');
      // 不设置 hasError，让 WebView 继续尝试
      return;
    }
    
    // 临时弹窗显示 HTTP 错误信息
    Alert.alert(
      'WebView HTTP Error',
      `Status: ${nativeEvent.statusCode}\nDescription: ${nativeEvent.description}\nURL: ${nativeEvent.url}`,
      [{ text: 'OK' }]
    );
    
    setErrorDetails(`HTTP ${nativeEvent.statusCode}: ${nativeEvent.description}`);
    setIsLoading(false);
    setHasError(true);
  };

  const retryLoad = () => {
    setHasError(false);
    setErrorDetails('');
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
  };

  const webViewConfig = {
    allowsInlineMediaPlayback: true,
    mediaPlaybackRequiresUserAction: false,
    allowsProtectedMedia: true,
    allowsAirPlayForMediaPlayback: true,
    allowsPictureInPictureMediaPlayback: true,
    allowsFullscreenVideo: true,
    
    allowsCamera: true,
    allowsMicrophone: true,
    allowsLocation: true,
    
    javaScriptEnabled: true,
    mixedContentMode: 'always' as const,
    allowsFileAccess: true,
    allowsContentAccess: true,
    thirdPartyCookiesEnabled: true,
    
    allowsBackForwardNavigationGestures: true,
    allowsLinkPreview: true,
    
    cacheEnabled: false,
    incognito: false,
    
    onShouldStartLoadWithRequest: (request: any) => {
      console.log('WebView request:', request.url);
      console.log('Request method:', request.method);
      console.log('Request headers:', request.headers);
      
      // 允许所有 Vercel 相关的请求在 WebView 中处理
      if (request.url.includes('vercel.com') || request.url.includes('live-api-web-console')) {
        return true;
      }
      
      // 对于其他外部链接，可以选择是否在 WebView 中打开
      return true;
    },
    
    onError: handleError,
    onHttpError: handleHttpError,
    
    onSSLError: (syntheticEvent: any) => {
      const { nativeEvent } = syntheticEvent;
      console.log('SSL Error details:', nativeEvent);
      Alert.alert('SSL Error', `SSL Error: ${JSON.stringify(nativeEvent)}`);
      return true;
    },
  };

  if (hasError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mood Match</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😔</Text>
          <Text style={styles.errorTitle}>Connection Failed</Text>
          <Text style={styles.errorMessage}>
            Unable to connect to the Mood Match service. Please check your network connection and try again.
          </Text>
          {errorDetails ? (
            <Text style={styles.errorDetails}>
              Error Details: {errorDetails}
            </Text>
          ) : null}
          <TouchableOpacity onPress={retryLoad} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood Match</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.webViewContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FB7185" />
            <Text style={styles.loadingText}>Loading Mood Match...</Text>
          </View>
        )}
        
        <WebView
          source={{ 
            uri: WEB_CONSOLE_URL,
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
            }
          }}
          style={styles.webView}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          startInLoadingState={true}
          renderLoading={() => <View />}
          {...webViewConfig}
          cacheEnabled={false}
          incognito={false}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          allowsCamera={true}
          allowsMicrophone={true}
          allowsLocation={true}
          onSSLError={() => {
            console.log('SSL Error ignored for development');
            return true;
          }}
          onMessage={handleMessage}
          injectedJavaScript={`
             (function() {
               console.log('WebView JavaScript injected successfully');
               
               // 全局音频监控设置
               window.audioMonitoringEnabled = true;
               window.lastAudioBuffer = null;
               
               // 音频上下文恢复函数
               function resumeAudioContext() {
                 if (window.AudioContext || window.webkitAudioContext) {
                   const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                   if (!window.audioContext) {
                     window.audioContext = new AudioContextClass();
                   }
                   if (window.audioContext.state === 'suspended') {
                     window.audioContext.resume().then(() => {
                       console.log('🔊 WebView: AudioContext resumed successfully');
                       window.ReactNativeWebView.postMessage(JSON.stringify({
                         type: 'AUDIO_CONTEXT_RESUMED',
                         timestamp: Date.now()
                       }));
                     });
                   }
                 }
               }
               
               // 强制播放音频函数
               function forcePlayAudio(audioElement) {
                 if (audioElement) {
                   console.log('🔊 WebView: Attempting to force play audio');
                   audioElement.play().then(() => {
                     console.log('🔊 WebView: Audio started playing successfully');
                     window.ReactNativeWebView.postMessage(JSON.stringify({
                       type: 'AUDIO_PLAYING',
                       timestamp: Date.now()
                     }));
                   }).catch((error) => {
                     console.error('🔊 WebView: Audio play failed:', error);
                     window.ReactNativeWebView.postMessage(JSON.stringify({
                       type: 'AUDIO_PLAY_ERROR',
                       error: error.message,
                       timestamp: Date.now()
                     }));
                   });
                 }
               }
               
               // 创建并播放AI音频的函数
               function createAndPlayAIAudio(audioBuffer) {
                 try {
                   console.log('🔊 WebView: Creating AI audio element, buffer size:', audioBuffer.byteLength);
                   
                   // 创建Blob对象
                   const blob = new Blob([audioBuffer], { type: 'audio/wav' });
                   const audioUrl = URL.createObjectURL(blob);
                   
                   // 创建audio元素
                   const audio = new Audio(audioUrl);
                   audio.volume = 1.0;
                   audio.autoplay = false;
                   
                   // 添加到DOM
                   audio.style.display = 'none';
                   audio.id = 'ai-audio-' + Date.now();
                   document.body.appendChild(audio);
                   
                   // 播放音频
                   setTimeout(() => {
                     audio.play().then(() => {
                       console.log('🔊 WebView: AI audio started playing via <audio> tag');
                       window.ReactNativeWebView.postMessage(JSON.stringify({
                         type: 'AI_AUDIO_PLAYING',
                         timestamp: Date.now(),
                         audioId: audio.id
                       }));
                     }).catch((error) => {
                       console.error('🔊 WebView: AI audio play failed:', error);
                       window.ReactNativeWebView.postMessage(JSON.stringify({
                         type: 'AI_AUDIO_PLAY_ERROR',
                         error: error.message,
                         timestamp: Date.now()
                       }));
                     });
                   }, 100);
                   
                   // 清理资源
                   audio.onended = () => {
                     URL.revokeObjectURL(audioUrl);
                     if (audio.parentNode) {
                       audio.parentNode.removeChild(audio);
                     }
                   };
                 } catch (error) {
                   console.error('🔊 WebView: Error creating AI audio element:', error);
                 }
               }
               
               // 拦截AudioContext的播放
               function interceptAudioContext() {
                 if (window.AudioContext || window.webkitAudioContext) {
                   const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                   
                   // 拦截AudioContext构造函数
                   const OriginalAudioContext = AudioContextClass;
                   window.AudioContext = function(...args) {
                     const context = new OriginalAudioContext(...args);
                     console.log('🔊 WebView: AudioContext created');
                     
                     // 拦截resume方法
                     const originalResume = context.resume;
                     context.resume = function() {
                       console.log('🔊 WebView: AudioContext.resume() called');
                       window.ReactNativeWebView.postMessage(JSON.stringify({
                         type: 'AUDIO_CONTEXT_RESUME_CALLED',
                         timestamp: Date.now()
                       }));
                       return originalResume.call(this);
                     };
                     
                     return context;
                   };
                   window.AudioContext.prototype = OriginalAudioContext.prototype;
                   
                   // 同样处理webkitAudioContext
                   if (window.webkitAudioContext) {
                     window.webkitAudioContext = window.AudioContext;
                   }
                 }
               }
               
               // 拦截 <audio> 元素的创建和播放
               function interceptAudioElements() {
                 const originalAudio = window.Audio;
                 window.Audio = function(...args) {
                   const audio = new originalAudio(...args);
                   console.log('🔊 WebView: <audio> element created');
                   window.ReactNativeWebView.postMessage(JSON.stringify({
                     type: 'AUDIO_ELEMENT_CREATED',
                     timestamp: Date.now()
                   }));
                   
                   // 拦截play方法
                   const originalPlay = audio.play;
                   audio.play = function() {
                     console.log('🔊 WebView: audio.play() called');
                     window.ReactNativeWebView.postMessage(JSON.stringify({
                       type: 'AUDIO_PLAY_CALLED',
                       timestamp: Date.now()
                     }));
                     return originalPlay.call(this);
                   };
                   
                   return audio;
                 };
                 
                 // 监听所有现有的audio元素
                 const existingAudioElements = document.querySelectorAll('audio');
                 existingAudioElements.forEach(audio => {
                   console.log('🔊 WebView: Found existing <audio> element');
                   window.ReactNativeWebView.postMessage(JSON.stringify({
                     type: 'AUDIO_ELEMENT_DETECTED',
                     timestamp: Date.now(),
                     src: audio.src || 'unknown'
                   }));
                   
                   // 监听播放事件
                   audio.addEventListener('play', () => {
                     console.log('🔊 WebView: Audio play event detected');
                     window.ReactNativeWebView.postMessage(JSON.stringify({
                       type: 'AUDIO_PLAY_EVENT',
                       timestamp: Date.now()
                     }));
                   });
                   
                   audio.addEventListener('error', (e) => {
                     console.error('🔊 WebView: Audio error event:', e);
                     window.ReactNativeWebView.postMessage(JSON.stringify({
                       type: 'AUDIO_ERROR_EVENT',
                       error: e.message || 'Unknown audio error',
                       timestamp: Date.now()
                     }));
                   });
                 });
               }
               
               // 监听DOM变化，检测新增的audio元素
               function observeAudioElements() {
                 const observer = new MutationObserver((mutations) => {
                   mutations.forEach((mutation) => {
                     mutation.addedNodes.forEach((node) => {
                       if (node.tagName === 'AUDIO') {
                         console.log('🔊 WebView: New <audio> element added to DOM');
                         window.ReactNativeWebView.postMessage(JSON.stringify({
                           type: 'AUDIO_ELEMENT_DETECTED',
                           timestamp: Date.now(),
                           src: node.src || 'unknown'
                         }));
                         
                         // 为新元素添加事件监听器
                         node.addEventListener('play', () => {
                           console.log('🔊 WebView: Audio play event detected (new element)');
                           window.ReactNativeWebView.postMessage(JSON.stringify({
                             type: 'AUDIO_PLAY_EVENT',
                             timestamp: Date.now()
                           }));
                         });
                         
                         node.addEventListener('error', (e) => {
                           console.error('🔊 WebView: Audio error event (new element):', e);
                           window.ReactNativeWebView.postMessage(JSON.stringify({
                             type: 'AUDIO_ERROR_EVENT',
                             error: e.message || 'Unknown audio error',
                             timestamp: Date.now()
                           }));
                         });
                       }
                     });
                   });
                 });
                 
                 observer.observe(document.body, {
                   childList: true,
                   subtree: true
                 });
               }
               
               // WebSocket监控函数
               function monitorWebSocketAudio() {
                 if (window.WebSocket) {
                   const OriginalWebSocket = window.WebSocket;
                   window.WebSocket = function(...args) {
                     const ws = new OriginalWebSocket(...args);
                     console.log('🔊 WebView: WebSocket created');
                     
                     const originalOnMessage = ws.onmessage;
                     ws.onmessage = function(event) {
                       // 检查是否是音频数据
                       if (event.data instanceof ArrayBuffer || 
                           (typeof event.data === 'string' && event.data.includes('audio')) ||
                           (event.data instanceof Blob)) {
                         
                         let audioDataDetected = false;
                         let partsCount = 0;
                         
                         if (event.data instanceof ArrayBuffer) {
                           audioDataDetected = true;
                           console.log('🔊 WebView: WebSocket audio ArrayBuffer detected, size:', event.data.byteLength);
                         } else if (typeof event.data === 'string') {
                           try {
                             const parsed = JSON.parse(event.data);
                             if (parsed.type === 'audio' || 
                                 (parsed.parts && parsed.parts.some(p => p.inlineData && p.inlineData.mimeType && p.inlineData.mimeType.startsWith('audio/')))) {
                               audioDataDetected = true;
                               partsCount = parsed.parts ? parsed.parts.length : 1;
                               console.log('🔊 WebView: WebSocket audio JSON detected, parts:', partsCount);
                               
                               // 尝试创建和播放音频
                               if (parsed.parts) {
                                 parsed.parts.forEach(part => {
                                   if (part.inlineData && part.inlineData.data && part.inlineData.mimeType.startsWith('audio/')) {
                                     try {
                                       const audioData = atob(part.inlineData.data);
                                       const audioBuffer = new ArrayBuffer(audioData.length);
                                       const audioView = new Uint8Array(audioBuffer);
                                       for (let i = 0; i < audioData.length; i++) {
                                         audioView[i] = audioData.charCodeAt(i);
                                       }
                                       
                                       // 存储音频缓冲区
                                       window.lastAudioBuffer = audioBuffer;
                                       
                                       // 尝试创建和播放音频
                                       createAndPlayAIAudio(audioBuffer);
                                     } catch (audioError) {
                                       console.error('🔊 WebView: Error processing audio data:', audioError);
                                     }
                                   }
                                 });
                               }
                             }
                           } catch (e) {
                             // 不是JSON，继续检查其他格式
                           }
                         }
                         
                         if (audioDataDetected) {
                           window.ReactNativeWebView.postMessage(JSON.stringify({
                             type: 'WEBSOCKET_AUDIO_DETECTED',
                             timestamp: Date.now(),
                             partsCount: partsCount
                           }));
                         }
                       }
                       
                       if (originalOnMessage) {
                         return originalOnMessage.call(this, event);
                       }
                     };
                     
                     return ws;
                   };
                 }
               }
               
               // 初始化所有监控
               function initializeAudioMonitoring() {
                 console.log('🔊 WebView: Initializing audio monitoring...');
                 
                 // 恢复音频上下文
                 resumeAudioContext();
                 
                 // 拦截AudioContext
                 interceptAudioContext();
                 
                 // 拦截Audio元素
                 interceptAudioElements();
                 
                 // 观察DOM变化
                 observeAudioElements();
                 
                 // 监控WebSocket
                 monitorWebSocketAudio();
                 
                 console.log('🔊 WebView: Audio monitoring initialized');
               }
               
               // 页面加载完成后初始化
               if (document.readyState === 'loading') {
                 document.addEventListener('DOMContentLoaded', initializeAudioMonitoring);
               } else {
                 initializeAudioMonitoring();
               }
               
               // 用户交互时恢复音频上下文
               document.addEventListener('click', resumeAudioContext);
               document.addEventListener('touchstart', resumeAudioContext);
               
               // 定期检查和恢复音频上下文
               setInterval(() => {
                 if (window.audioContext && window.audioContext.state === 'suspended') {
                   console.log('🔊 WebView: AudioContext suspended, attempting to resume...');
                   resumeAudioContext();
                 }
               }, 5000);
               
             })();
             true;
           `}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FB7185',
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  placeholder: {
    width: 50,
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  errorDetails: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: '#FB7185',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});