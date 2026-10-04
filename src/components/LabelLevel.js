import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

export default function LabelLevel({ level }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{level}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: radius.full,
        backgroundColor: colors.superficie,
        borderWidth: 1,
        borderColor: colors.borde,
    },
    text: { fontSize: 12, fontWeight: '700', color: colors.texto },
});

