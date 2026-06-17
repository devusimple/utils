import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';

// Types for customizability
interface CalendarProps {
    initialDate?: Date;
    onDateSelect?: (date: Date) => void;
    accentColor?: string;
    markedDates?: string[]; // Array of 'YYYY-MM-DD' strings for the dots
    leftChevronIcon?: React.JSX.Element;
    rightChevronIcon?: React.JSX.Element;
    downChevronIcon?: React.JSX.Element;
}

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 48) / 7; // Accounting for container padding

const WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar({
    initialDate = new Date(),
    onDateSelect,
    accentColor = '#1A62FF', // The vibrant blue from your design
    markedDates = ['2024-01-30'], // Example mock data matching your image
    leftChevronIcon,
    rightChevronIcon,
    downChevronIcon
}: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2024, 0, 9)); // Matching image (Jan 9)

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Pure JS Matrix Generation
    const calendarGrid = useMemo(() => {
        // 1. Get first day of the month and total days in current month
        const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
        const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // 2. Get total days in previous month for the padding grid
        const totalDaysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        // Adjust JS Sunday (0) to match Monday (0) as start of week sequence
        const startPadding = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

        const daysArray = [];

        // Previous Month Padding Days
        for (let i = startPadding - 1; i >= 0; i--) {
            daysArray.push({
                date: new Date(currentYear, currentMonth - 1, totalDaysInPrevMonth - i),
                isCurrentMonth: false,
            });
        }

        // Current Month Days
        for (let i = 1; i <= totalDaysInMonth; i++) {
            daysArray.push({
                date: new Date(currentYear, currentMonth, i),
                isCurrentMonth: true,
            });
        }

        // Next Month Padding Days to fill up the 42-cell matrix (6 weeks * 7 days)
        const remainingCells = 42 - daysArray.length;
        for (let i = 1; i <= remainingCells; i++) {
            daysArray.push({
                date: new Date(currentYear, currentMonth + 1, i),
                isCurrentMonth: false,
            });
        }

        return daysArray;
    }, [currentYear, currentMonth]);

    // Helper to format Date object to YYYY-MM-DD safely without timezone shifts
    const formatDateString = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localizedDate = new Date(date.getTime() - offset * 60 * 1000);
        return localizedDate.toISOString().split('T')[0];
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    return (
        <View style={styles.cardContainer}>
            {/* 1. HEADER SECTION */}
            <View style={styles.header}>
                <Pressable
                    onPress={handlePrevMonth}
                    style={styles.navButton}
                    hitSlop={12}
                >
                    {
                        leftChevronIcon ? (
                            leftChevronIcon
                        ) : (
                            <Text style={styles.navArrow}>‹</Text>
                        )
                    }
                </Pressable>

                <Pressable style={styles.monthDropdownRow} hitSlop={10}>
                    <Text style={styles.monthTitle}>{`${MONTH_NAMES[currentMonth]} ${currentYear}`}</Text>
                    {
                        downChevronIcon ? (
                            downChevronIcon
                        ) : (
                            <Text style={styles.dropdownChevron}>▾</Text>
                        )
                    }
                </Pressable>

                <Pressable
                    onPress={handleNextMonth}
                    style={styles.navButton}
                    hitSlop={12}
                >
                    {
                        rightChevronIcon ? (
                            rightChevronIcon
                        ) : (
                            <Text style={styles.navArrow}>›</Text>
                        )
                    }
                </Pressable>
            </View>

            {/* 2. WEEKDAYS HEADER */}
            <View style={styles.weekDaysRow}>
                {WEEK_DAYS.map((day, idx) => (
                    <Text key={idx} style={styles.weekDayText}>{day}</Text>
                ))}
            </View>

            {/* 3. CALENDAR GRID MATRIX */}
            <View style={styles.gridContainer}>
                {calendarGrid.map((item, index) => {
                    const dateString = formatDateString(item.date);
                    const isSelected = selectedDate && formatDateString(selectedDate) === dateString;
                    const isSecondaryActive = dateString === '2024-01-28'; // Static indicator match for demo
                    const hasDotIndicator = markedDates.includes(dateString);

                    return (
                        <Pressable
                            key={index}
                            style={[
                                styles.dayCell,
                                isSelected && { backgroundColor: accentColor }
                            ]}
                            disabled={!item.isCurrentMonth}
                            onPress={() => {
                                setSelectedDate(item.date);
                                if (onDateSelect) onDateSelect(item.date);
                            }}
                        >
                            <Text style={[
                                styles.dayText,
                                !item.isCurrentMonth && styles.disabledDayText,
                                isSelected && styles.selectedDayText,
                                isSecondaryActive && !isSelected && { color: accentColor, fontWeight: '600' }
                            ]}>
                                {item.date.getDate()}
                            </Text>

                            {/* Event Indicator Dot */}
                            {hasDotIndicator && (
                                <View style={[
                                    styles.dotIndicator,
                                    { backgroundColor: isSelected ? '#FFFFFF' : accentColor }
                                ]} />
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 16,
        width: width - 16,
        maxWidth: 400,
        shadowColor: '#E2E8F0',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 8,
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    monthDropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    dropdownChevron: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    navButton: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    navArrow: {
        fontSize: 18,
        color: '#64748B',
        fontWeight: '300',
        bottom: 2, // Fine-tuning vertical alignment inside the box
    },
    weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    weekDayText: {
        width: CELL_SIZE,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '500',
        color: '#94A3B8',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    dayCell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: CELL_SIZE / 2,
        borderRadius: 14,
        marginVertical: 2,
        position: 'relative',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#1E293B',
    },
    disabledDayText: {
        color: '#CBD5E1',
    },
    selectedDayText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    dotIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        bottom: 6,
    },
});
