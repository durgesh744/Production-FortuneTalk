import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';

class _NotificationManager {
  initNotification = async () => {
    await notifee.requestPermission();
  };

  onNotification = message => {
    try {
      const {data} = message;

      switch (data?.type) {
        case 'chat_request': {
          this.showChatNotification(message);
          break;
        }
        default: {
          this.showDefaultNotification(message);
          break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  showChatNotification = async message => {
    const {data, notification} = message;
    const {title, body} = notification;
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'chat_request',
      name: 'Chat Request',
      vibration: true,
      vibrationPattern: [300, 500],
    });

    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        importance: AndroidImportance.HIGH,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        category: AndroidCategory.CALL,
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  showDefaultNotification = async message => {
    const {data, notification} = message;
    const {title, body} = notification;
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH,
      vibration: true,
      vibrationPattern: [300, 500],
    });

    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        importance: AndroidImportance.DEFAULT,
        visibility: AndroidVisibility.PUBLIC,
        category: AndroidCategory.CALL,
        pressAction: {
          id: 'default',
        },
      },
    });
  };
}

const NotificationManager = new _NotificationManager();

export default NotificationManager;
