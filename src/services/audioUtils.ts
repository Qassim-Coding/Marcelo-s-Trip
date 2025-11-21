
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const playBase64Audio = async (base64Audio: string): Promise<void> => {
  // Gemini output is 24kHz
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  
  try {
    // 1. Decode the base64 string to Raw Bytes
    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 2. Convert Raw PCM (Int16) to AudioBuffer (Float32)
    // Gemini TTS returns raw 16-bit signed integer PCM samples
    const dataInt16 = new Int16Array(bytes.buffer);
    const numChannels = 1; // Mono
    
    const audioBuffer = audioContext.createBuffer(
      numChannels,
      dataInt16.length,
      24000 // Sample Rate matches Gemini output
    );
    
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      // Normalize 16-bit int to range [-1.0, 1.0]
      channelData[i] = dataInt16[i] / 32768.0;
    }
    
    // 3. Play
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);

    return new Promise((resolve) => {
      source.onended = () => {
        source.disconnect();
        audioContext.close();
        resolve();
      };
    });
  } catch (e) {
    console.error("Audio playback error:", e);
    audioContext.close();
    return Promise.resolve();
  }
};
