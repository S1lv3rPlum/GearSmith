import * as Updates from 'expo-updates';

const UpdateChecker = {
  /**
   * Check if an update is available
   * @returns {Promise<{available: boolean, type: string|null, updateInfo: object|null}>}
   */
  checkForUpdate: async () => {
    try {
      // Check if we're running in Expo Go - updates don't work there
      if (__DEV__) {
        console.log('Updates are disabled in development mode');
        return {
          available: false,
          type: null,
          updateInfo: null,
        };
      }

      const update = await Updates.checkForUpdateAsync();
      
      return {
        available: update.isAvailable,
        type: 'expo-updates',
        updateInfo: update.isAvailable ? update.manifest : null,
      };
    } catch (error) {
      console.error('Expo Updates check failed:', error);
      return {
        available: false,
        type: null,
        updateInfo: null,
      };
    }
  },

  /**
   * Start the update process
   * @param {boolean} immediate - If true, app reloads immediately. If false, downloads in background
   * @returns {Promise<void>}
   */
  startUpdate: async (immediate = false) => {
    try {
      if (__DEV__) {
        console.log('Updates are disabled in development mode');
        return;
      }

      // Fetch the update
      const result = await Updates.fetchUpdateAsync();

      if (result.isNew) {
        if (immediate) {
          // Reload app immediately to apply update
          await Updates.reloadAsync();
        }
        // If not immediate, update is downloaded and will apply on next app restart
      }
    } catch (error) {
      console.error('Expo Updates fetch/reload failed:', error);
      throw error;
    }
  },

  /**
   * Get the current update info
   * @returns {Promise<object|null>}
   */
  getCurrentVersion: async () => {
    try {
      if (__DEV__) {
        return { isDevelopment: true };
      }

      const updateInfo = await Updates.checkForUpdateAsync();
      return {
        currentlyRunning: Updates.updateId,
        channel: Updates.channel,
        ...updateInfo,
      };
    } catch (error) {
      console.error('Failed to get Expo Updates info:', error);
      return null;
    }
  },
};

export default UpdateChecker;