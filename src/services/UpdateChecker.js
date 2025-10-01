import CodePush from 'react-native-code-push';

const UpdateChecker = {
  /**
   * Check if an update is available
   * @returns {Promise<{available: boolean, type: string|null, updateInfo: object|null}>}
   */
  checkForUpdate: async () => {
    try {
      const update = await CodePush.checkForUpdate();
      return {
        available: !!update,
        type: 'codepush',
        updateInfo: update, // Contains version info, description, etc.
      };
    } catch (error) {
      console.error('CodePush check failed:', error);
      return { 
        available: false, 
        type: null,
        updateInfo: null,
      };
    }
  },

  /**
   * Start the update process
   * @param {boolean} immediate - If true, app restarts immediately. If false, installs on next restart
   * @returns {Promise<void>}
   */
  startUpdate: async (immediate = false) => {
    try {
      if (immediate) {
        // User chose to restart now - app will restart immediately
        await CodePush.sync({
          installMode: CodePush.InstallMode.IMMEDIATE,
          updateDialog: {
            title: 'Installing Update',
            mandatoryUpdateMessage: 'The app will restart to complete the update.',
            mandatoryContinueButtonLabel: 'Restart Now',
          },
        });
      } else {
        // Download in background, install on next app restart
        await CodePush.sync({
          installMode: CodePush.InstallMode.ON_NEXT_RESTART,
        });
      }
    } catch (error) {
      console.error('CodePush update failed:', error);
      throw error;
    }
  },

  /**
   * Get the current CodePush metadata (version info)
   * @returns {Promise<object|null>}
   */
  getCurrentVersion: async () => {
    try {
      const metadata = await CodePush.getUpdateMetadata();
      return metadata;
    } catch (error) {
      console.error('Failed to get CodePush metadata:', error);
      return null;
    }
  },
};

export default UpdateChecker;