import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

// --- Picker Props ---
export interface PickerProps {
    defaultValue?: any
    onDone?: (selectedValue: any) => void
    children?: React.ReactNode
    title?: string
    open: boolean
}

// --- Picker Component ---
export function Picker({ defaultValue, onDone, children, title, open }: PickerProps) {
    const [selectedValue, setSelectedValue] = useState<any>(defaultValue ?? null)

    const handleDone = () => {
        onDone?.(selectedValue)
    }

    // Clone each PickerItem to inject selection state and press handler
    const renderedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === PickerItem) {
            const element = child as React.ReactElement<any>
            return React.cloneElement(element, {
                isSelected: element.props.value === selectedValue,
                onPress: () => setSelectedValue(element.props.value),
            })
        }
        return child
    })

    return (
        <Modal
            visible={open}
            transparent
            statusBarTranslucent
            style={StyleSheet.absoluteFill}
            animationType='fade'
        >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
                <View
                    style={{
                        backgroundColor: '#f5f5f5',
                        padding: 12,
                        width: '86%',
                        maxHeight: 300,
                        minHeight: 200,
                        borderRadius: 14,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>{title ? title : "Select an item"}</Text>
                        <Pressable style={{
                            paddingVertical: 6,
                            paddingLeft: 12
                        }} onPress={handleDone}>
                            <Text style={{ color: "#4f23ec" }}>Done</Text>
                        </Pressable>
                    </View>

                    {children ? (
                        <ScrollView
                            contentContainerStyle={{ gap: 6 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {renderedChildren}
                        </ScrollView>
                    ) : (
                        <Text>No item to select</Text>
                    )}
                </View>
            </View>
        </Modal>

    )
}

// --- PickerItem Props ---
interface PickerItemProps {
    /** Unique value for this item */
    value: any
    /** Display text (optional if children are provided) */
    label?: string
    children?: React.ReactNode
    // Internal props injected by Picker (not set by user)
    isSelected?: boolean
    onPress?: () => void
}

// --- PickerItem Component ---
export function PickerItem({
    label,
    children,
    isSelected,
    onPress,
}: PickerItemProps) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                padding: 12,
                backgroundColor: isSelected ? '#4A90E2' : '#ddd',
                borderRadius: 6,
            }}
        >
            <Text style={{ color: isSelected ? '#fff' : '#000' }}>
                {children ?? label}
            </Text>
        </Pressable>
    )
}
