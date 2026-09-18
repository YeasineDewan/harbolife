import React from 'react';
import { View } from 'react-native';

export const MailIcon = ({ color = '#9ca3af' }) => (
  <View style={{ width: 20, height: 14, borderWidth: 1.8, borderColor: color, borderRadius: 3, overflow: 'hidden' }}>
    <View style={{
      position: 'absolute',
      top: -7,
      left: 2,
      width: 12,
      height: 12,
      borderWidth: 1.8,
      borderColor: color,
      transform: [{ rotate: '45deg' }]
    }} />
  </View>
);

export const LockIcon = ({ color = '#9ca3af' }) => (
  <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'flex-end' }}>
    <View style={{
      width: 12,
      height: 10,
      borderWidth: 1.8,
      borderColor: color,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomWidth: 0,
      marginBottom: -1,
    }} />
    <View style={{
      width: 18,
      height: 10,
      borderWidth: 1.8,
      borderColor: color,
      borderRadius: 3,
      backgroundColor: 'transparent',
    }} />
  </View>
);

export const UserIcon = ({ color = '#9ca3af' }) => (
  <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: 8,
      height: 8,
      borderRadius: 4,
      borderWidth: 1.8,
      borderColor: color,
      marginBottom: 2,
    }} />
    <View style={{
      width: 16,
      height: 8,
      borderWidth: 1.8,
      borderColor: color,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomWidth: 0,
    }} />
  </View>
);

export const EyeIcon = ({ color = '#9ca3af' }) => (
  <View style={{ width: 22, height: 14, borderWidth: 1.8, borderColor: color, borderRadius: 7, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: color,
    }} />
  </View>
);

export const EyeOffIcon = ({ color = '#9ca3af' }) => (
  <View style={{ width: 22, height: 14, borderWidth: 1.8, borderColor: color, borderRadius: 7, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: color,
    }} />
    <View style={{
      position: 'absolute',
      width: 20,
      height: 1.8,
      backgroundColor: color,
      transform: [{ rotate: '45deg' }]
    }} />
  </View>
);

export const ArrowLeftIcon = ({ color = '#9ca3af' }) => (
  <View style={{ width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      width: 10,
      height: 10,
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderColor: color,
      transform: [{ rotate: '45deg' }],
      marginLeft: 4,
    }} />
    <View style={{
      position: 'absolute',
      width: 12,
      height: 2,
      backgroundColor: color,
      left: 2,
    }} />
  </View>
);
