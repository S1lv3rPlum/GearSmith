// Skeleton service for in-app update logic using react-native-in-app-update
import InAppUpdate from 'react-native-in-app-update';
const UpdateChecker = {
  checkForUpdate: async () => {
    try {
      const updateStatus = await InAppUpdate.checkNeedsUpdate();
      return {
        available: updateStatus.shouldUpdate,
        type: updateStatus.flexible ? 'flexible' : 'immediate',
      };
    } catch (error) {
      throw new Error('Update check failed');
    }
  },
  startUpdate: async (type) => {
    if (type === 'flexible') {
      await InAppUpdate.startFlexibleUpdate();
    } else {
      await InAppUpdate.startImmediateUpdate();
    }
  },
};
export default UpdateChecker;