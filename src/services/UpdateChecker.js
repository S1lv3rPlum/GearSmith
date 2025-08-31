// Dummy UpdateChecker without react-native-in-app-update to avoid build errors
const UpdateChecker = {
  checkForUpdate: async () => {
    // Always report no update available
    return {
      available: false,
      type: null,
    };
  },
  startUpdate: async (type) => {
    // No-op: update system is disabled/removed
  },
};
export default UpdateChecker;