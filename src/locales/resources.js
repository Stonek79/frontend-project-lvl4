export default {
  en: {
    translation: {
      errors: {
        minMessage: (min) => `Must be at least ${min} characters`,
        maxMessage: (max) => `Must be ${max} characters or less`,
        required: 'Required fill out this field',
        netError: 'Network error',
        notOneOf: 'Channel name already exist',
      },
      buttons: {
        cancel: 'Cancel',
        create: 'Create',
        rename: 'Confirm',
        remove: 'Yes',
        send: 'Send message',
        process: {
          creating: 'Creating...',
          removing: 'Removing...',
          renaming: 'Renaming...',
          sending: 'Sending...',
        },
      },
      titles: {
        createChannel: 'Create channel',
        removeChannel: 'Removing channel',
        renameChannel: 'Renaming channel',
      },
      labels: {
        channels: 'Channels',
      },
    },
  },
};
