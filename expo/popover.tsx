import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    ViewStyle,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface PopoverRef {
    show: (triggerRef: React.RefObject<View>) => void;
    hide: () => void;
}

interface PopoverProps {
    children: React.ReactNode;
    contentStyle?: ViewStyle;
}

const Popover = forwardRef<PopoverRef, PopoverProps>(({ children, contentStyle }, ref) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const popoverWidth = useRef(220); // Default fallback width for calculations

    useImperativeHandle(ref, () => ({
        show: (triggerRef) => {
            if (triggerRef.current) {
                triggerRef.current.measure((fx, fy, localWidth, localHeight, px, py) => {
                    // Calculate positions
                    let top = py + localHeight + 5; // 5px spacing below trigger
                    let left = px;

                    // Simple screen boundary checks
                    if (left + popoverWidth.current > SCREEN_WIDTH) {
                        left = SCREEN_WIDTH - popoverWidth.current - 15; // 15px padding from right edge
                    }
                    if (top + 200 > SCREEN_HEIGHT) {
                        top = py - 205; // Flip to open above if running out of space at the bottom
                    }

                    setPosition({ top, left });
                    setVisible(true);
                });
            }
        },
        hide: () => setVisible(false),
    }));

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
            <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View
                            style={[
                                styles.popoverContainer,
                                { top: position.top, left: position.left, width: popoverWidth.current },
                                contentStyle,
                            ]}
                        >
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
});

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Subtle backdrop tint
    },
    popoverContainer: {
        position: 'absolute',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        // Premium shadow styling
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
});

Popover.displayName = 'Popover';
export default Popover;
