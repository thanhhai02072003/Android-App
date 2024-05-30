import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { formatDistanceToNow } from 'date-fns';


export default function Noti() {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:3000/activities');
            const data = await response.json();
            const notification = data.map(item => ({
                id: item.activity_id,
                message: item.device_id.startsWith('L') ? `Light ${item.device_id.slice(1)} has just turned ${item.acttivity_description}` : item.acttivity_description,
                time: formatDistanceToNow(new Date(item.activity_time)) + ' ago',
            })).sort((a, b) => b.id - a.id);
            setNotifications(notification);
        }
        catch (error) {
            console.error("Error:", error);
        }
    }
    

    useEffect(() => {
        const interval = setInterval(() => {
            fetchNotifications();
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Today</Text>
            <ScrollView style={{ flex: 1, width: '100%' }}>
                {notifications.map(notification => (
                    <TouchableOpacity key={notification.id} style={{ padding: 20, margin: 10, width: '80%', borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name="bell" size={30} color="#000" />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>Notice</Text>
                            <Text>{notification.message}</Text>
                            <Text style={{ fontSize: 12, color: '#888' }}>{notification.time}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};
