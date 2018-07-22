import React, {Component} from "react";
import {Text, View, Platform} from "react-native";
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType,
    NotificationActionType,
    NotificationActionOption,
    NotificationCategoryOption
} from "react-native-fcm";

//
//
//


FCM.on(FCMEvent.Notification, notif => {
    console.log("Notification", notif);

    if (notif.local_notification) {
        // this is local notification
    }

    if (notif.opened_from_tray) {
        if (notif.targetScreen === 'detail') {
            setTimeout(() => {
                navigation.navigate('Detail')
            }, 500)
        }
        setTimeout(() => {
            alert(`User tapped notification\n${JSON.stringify(notif)}`)
        }, 500)
    }
    if (Platform.OS === 'ios' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification) {
        // this notification is only to decide if you want to show the notification when user if in foreground.
        // usually you can ignore it. just decide to show or not.
        notif.finish(WillPresentNotificationResult.All)
        return;
    }

    if (Platform.OS === 'ios') {
        //optional
        //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
        //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
        //notif._notificationType is available for iOS platfrom
        switch (notif._notificationType) {
            case NotificationType.Remote:
                notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                break;
            case NotificationType.NotificationResponse:
                notif.finish();
                break;
            case NotificationType.WillPresent:
                notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                // this type of notificaiton will be called only when you are in foreground.
                // if it is a remote notification, don't do any app logic here. Another notification callback will be triggered with type NotificationType.Remote
                break;
        }
    }


});


FCM.on(FCMEvent.RefreshToken, token => {
    console.log("TOKEN (refreshUnsubscribe)", token);
});


export default class App extends Component {



    componentDidMount() {
        FCM.requestPermissions()
            .then(() => console.log('Genered'))
            .catch(() => console.log('Notification permiss is Faild'));
        FCM.getFCMToken()
            .then(token => {
                console.warn(token)




            });

        this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
            // Do some component for us !
            console.log('hi colsooso')
        });

        FCM.getInitialNotification()
            .then(notif => {
                console.log(notif)

            });

    }

    componentWillUnmount() {
        console.log('notification is removed')

        this.notificationListener.remove();

    }



    render() {
        this.state={tokenId:'Hi world 1234'}

        return (
            <View>

                <Text> Hello my life 147 </Text>
                <Text> Hello my life </Text>
                <Text>Token Id : {this.state.tokenId} </Text>
                <Text> Hello my life </Text>
                <Text> Hello my life </Text>
                <Text> Hello my life </Text>
            </View>
        );


    }
}


