import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Audio } from 'expo-av';

interface MoodMatchScreenProps {
  onBack: () => void;
}

const WEB_CONSOLE_URL = 'https://live-api-web-console-https-w-git-278998-bobos-projects-ba40eeb2.vercel.app';

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

  const playTestAudio = async () => {
    try {
      console.log('🔊 Attempting to play test audio...');
      
      // 首先测试音频权限和模式设置
      console.log('🔊 Setting up audio mode...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false,
      });
      console.log('🔊 Audio mode set successfully');
      
      // 使用本地音频文件测试
      console.log('🔊 Creating audio sound from local file...');
      const { sound } = await Audio.Sound.createAsync(require('../../assets/test.mp3'));
      console.log('🔊 Audio sound created successfully');
      
      console.log('🔊 Starting playback...');
      await sound.playAsync();
      console.log('🔊 Test audio started playing');
      
      sound.setOnPlaybackStatusUpdate((status) => {
        console.log('🔊 Playback status:', status);
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          console.log('🔊 Test audio finished');
        }
      });
      
    } catch (e) {
      console.error('❌ Test audio error:', e);
      console.error('❌ Error details:', JSON.stringify(e, null, 2));
      console.log('💡 This suggests there might be an audio permission or configuration issue');
      console.log('💡 Please check:');
      console.log('   - Audio permissions in app settings');
      console.log('   - Device volume settings');
      console.log('   - test.mp3 file exists in assets folder');
    }
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
      {/* Test Audio Button */}
      <TouchableOpacity onPress={playTestAudio} style={{margin: 20, padding: 10, backgroundColor: '#eee', borderRadius: 8, alignItems: 'center'}}>
        <Text style={{fontWeight: 'bold'}}>Play Test Audio</Text>
      </TouchableOpacity>
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
                   
                   // 复制原型
                   window.AudioContext.prototype = OriginalAudioContext.prototype;
                   window.AudioContext.CONSTANTS = OriginalAudioContext.CONSTANTS;
                 }
               }
               
               // 拦截所有音频元素的创建
               function interceptAudioElements() {
                 const originalCreateElement = document.createElement;
                 document.createElement = function(tagName) {
                   const element = originalCreateElement.call(this, tagName);
                   if (tagName.toLowerCase() === 'audio') {
                     console.log('🔊 WebView: <audio> element created');
                     window.ReactNativeWebView.postMessage(JSON.stringify({
                       type: 'AUDIO_ELEMENT_CREATED',
                       timestamp: Date.now()
                     }));
                   }
                   return element;
                 };
               }
               
               // 拦截所有音频播放调用
               function interceptAudioPlay() {
                 const originalPlay = HTMLMediaElement.prototype.play;
                 HTMLMediaElement.prototype.play = function() {
                   if (this.tagName.toLowerCase() === 'audio') {
                     console.log('🔊 WebView: audio.play() called');
                     window.ReactNativeWebView.postMessage(JSON.stringify({
                       type: 'AUDIO_PLAY_CALLED',
                       timestamp: Date.now()
                     }));
                   }
                   return originalPlay.call(this);
                 };
               }
               
               // 监听WebSocket消息中的音频数据
               function interceptWebSocketAudio() {
                 // 拦截WebSocket构造函数
                 const OriginalWebSocket = window.WebSocket;
                 window.WebSocket = function(url, protocols) {
                   const ws = new OriginalWebSocket(url, protocols);
                   
                   // 拦截onmessage
                   const originalOnMessage = ws.onmessage;
                   ws.onmessage = function(event) {
                     try {
                       // 检查是否包含音频数据
                       if (event.data && typeof event.data === 'string') {
                         const data = JSON.parse(event.data);
                         if (data.serverContent && data.serverContent.modelTurn && data.serverContent.modelTurn.parts) {
                           const audioParts = data.serverContent.modelTurn.parts.filter(part => 
                             part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('audio/')
                           );
                           
                           if (audioParts.length > 0) {
                             console.log('🔊 WebView: WebSocket audio data detected:', audioParts.length, 'parts');
                             window.ReactNativeWebView.postMessage(JSON.stringify({
                               type: 'WEBSOCKET_AUDIO_DETECTED',
                               partsCount: audioParts.length,
                               timestamp: Date.now()
                             }));
                             
                             // 尝试播放第一个音频部分
                             const firstAudioPart = audioParts[0];
                             if (firstAudioPart.inlineData && firstAudioPart.inlineData.data) {
                               try {
                                 // 转换base64为ArrayBuffer
                                 const binaryString = atob(firstAudioPart.inlineData.data);
                                 const bytes = new Uint8Array(binaryString.length);
                                 for (let i = 0; i < binaryString.length; i++) {
                                   bytes[i] = binaryString.charCodeAt(i);
                                 }
                                 
                                 console.log('🔊 WebView: Converting audio data to ArrayBuffer, size:', bytes.byteLength);
                                 createAndPlayAIAudio(bytes.buffer);
                               } catch (error) {
                                 console.error('🔊 WebView: Error processing audio data:', error);
                               }
                             }
                           }
                         }
                       }
                     } catch (error) {
                       // 忽略JSON解析错误
                     }
                     
                     // 调用原始处理函数
                     if (originalOnMessage) {
                       originalOnMessage.call(this, event);
                     }
                   };
                   
                   return ws;
                 };
                 
                 // 复制原型
                 window.WebSocket.prototype = OriginalWebSocket.prototype;
                 window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
                 window.WebSocket.OPEN = OriginalWebSocket.OPEN;
                 window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
                 window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
               }
               
               // 检测是否在 Vercel 登录页面
               function checkLoginStatus() {
                 const currentUrl = window.location.href;
                 console.log('Current URL:', currentUrl);
                 
                 if (currentUrl.includes('vercel.com/login')) {
                   console.log('Detected Vercel login page');
                   // 可以在这里添加自动登录逻辑（如果有的话）
                 } else if (currentUrl.includes('live-api-web-console')) {
                   console.log('Successfully loaded the target application');
                   window.ReactNativeWebView.postMessage(JSON.stringify({
                     type: 'LOGIN_SUCCESS',
                     url: currentUrl
                   }));
                   
                   // 在页面加载完成后恢复音频上下文
                   setTimeout(resumeAudioContext, 1000);
                   
                   // 设置音频监控
                   setTimeout(() => {
                     interceptAudioContext();
                     interceptAudioElements();
                     interceptAudioPlay();
                     interceptWebSocketAudio();
                     console.log('🔊 WebView: Audio monitoring setup complete');
                   }, 2000);
                 }
               }
               
               // 监听 URL 变化
               let lastUrl = location.href;
               new MutationObserver(() => {
                 const url = location.href;
                 if (url !== lastUrl) {
                   lastUrl = url;
                   checkLoginStatus();
                 }
               }).observe(document, {subtree: true, childList: true});
               
               // 初始检查
               checkLoginStatus();
               
               // 监听音频相关事件
               document.addEventListener('click', function(e) {
                 console.log('🔊 WebView: Click event on:', e.target.tagName, e.target.className);
                 
                 // 在每次用户点击时恢复音频上下文
                 resumeAudioContext();
                 
                 // 检测麦克风按钮点击
                 if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                   const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
                   console.log('🔊 WebView: Button clicked:', button.textContent, button.className);
                   
                   // 检查是否是录音按钮
                   if (button.textContent.includes('mic') || button.textContent.includes('record') || 
                       button.className.includes('mic') || button.className.includes('record')) {
                     console.log('🔊 WebView: Microphone button detected!');
                     window.ReactNativeWebView.postMessage(JSON.stringify({
                       type: 'MIC_BUTTON_CLICKED',
                       timestamp: Date.now()
                     }));
                   }
                 }
                 
                 if (e.target.tagName === 'VIDEO') {
                   console.log('Video clicked, attempting fullscreen');
                   if (e.target.requestFullscreen) {
                     e.target.requestFullscreen();
                   } else if (e.target.webkitRequestFullscreen) {
                     e.target.webkitRequestFullscreen();
                   } else if (e.target.msRequestFullscreen) {
                     e.target.msRequestFullscreen();
                   } else if (e.target.mozRequestFullScreen) {
                     e.target.mozRequestFullScreen();
                   }
                 }
               });
               
               // 监听音频元素
               const audioObserver = new MutationObserver(function(mutations) {
                 mutations.forEach(function(mutation) {
                   if (mutation.type === 'childList') {
                     mutation.addedNodes.forEach(function(node) {
                       if (node.tagName === 'AUDIO') {
                         console.log('🔊 WebView: Audio element detected:', node);
                         
                         // 强制播放新创建的音频元素
                         setTimeout(() => {
                           forcePlayAudio(node);
                         }, 100);
                         
                         window.ReactNativeWebView.postMessage(JSON.stringify({
                           type: 'AUDIO_ELEMENT_DETECTED',
                           src: node.src,
                           duration: node.duration
                         }));
                       }
                     });
                   }
                 });
               });
               
               audioObserver.observe(document.body, {
                 childList: true,
                 subtree: true
               });
               
               // 监听现有音频元素的播放事件
               document.addEventListener('play', function(e) {
                 if (e.target.tagName === 'AUDIO') {
                   console.log('🔊 WebView: Audio play event detected');
                   window.ReactNativeWebView.postMessage(JSON.stringify({
                     type: 'AUDIO_PLAY_EVENT',
                     timestamp: Date.now()
                   }));
                 }
               }, true);
               
               // 监听音频错误事件
               document.addEventListener('error', function(e) {
                 if (e.target.tagName === 'AUDIO') {
                   console.error('🔊 WebView: Audio error event:', e);
                   window.ReactNativeWebView.postMessage(JSON.stringify({
                     type: 'AUDIO_ERROR_EVENT',
                     error: e.target.error ? e.target.error.message : 'Unknown error',
                     timestamp: Date.now()
                   }));
                 }
               }, true);
               
               if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                 navigator.mediaDevices.getUserMedia({ 
                   video: { 
                     width: { ideal: 1280 },
                     height: { ideal: 720 }
                   }, 
                   audio: true 
                 })
                 .then(function(stream) {
                   console.log('Camera and microphone access granted');
                 })
                 .catch(function(err) {
                   console.log('Camera and microphone access denied:', err);
                 });
               }
               
               if (navigator.geolocation) {
                 navigator.geolocation.getCurrentPosition(
                   function(position) {
                     console.log('Location access granted:', position.coords);
                   },
                   function(error) {
                     console.log('Location access denied:', error);
                   },
                   { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
                 );
               }
               
               document.addEventListener('fullscreenchange', function() {
                 console.log('Fullscreen changed:', !!document.fullscreenElement);
               });
               
               console.log('WebView setup complete');
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 60,
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
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorDetails: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  retryButton: {
    backgroundColor: '#FB7185',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 