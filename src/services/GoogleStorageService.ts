class GoogleStorageService {
  private readonly bucketUrl = 'https://storage.googleapis.com/active-audio';
  
  // Test connection with a simple fetch
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Google Storage connection...');
      
      // Try to fetch a known file
      const testUrl = `${this.bucketUrl}/Friday_boring_female.mp3`;
      console.log('Testing URL:', testUrl);
      
      const response = await fetch(testUrl, { method: 'HEAD' });
      console.log('Response status:', response.status);
      
      return response.ok;
    } catch (error) {
      console.error('Google Storage connection test failed:', error);
      return false;
    }
  }
  
  // Get URL for a daily audio file (e.g., "Wednesday_boring_female.mp3")
  getDailyAudioUrl(day: string, type: 'boring' | 'meandering', gender: 'male' | 'female'): string {
    const filename = `${day}_${type}_${gender}.mp3`;
    return `${this.bucketUrl}/${filename}`;
  }
  
  // Get URL for a library audio file by ID
  getLibraryAudioUrl(id: string, topic: string, gender: 'male' | 'female'): string {
    const filename = `${id}_${topic}_${gender}.mp3`;
    return `${this.bucketUrl}/archive/${filename}`;
  }
  
  // Get current day of week
  getCurrentDay(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }
}

export default new GoogleStorageService();