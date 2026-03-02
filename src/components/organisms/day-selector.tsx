import { ScrollView } from "react-native";
import { DayChip } from "@/components/molecules";
import { getDaysInWeek } from "@/lib/week";
import { spacing } from "@/lib/theme";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface DaySelectorProps {
  weekKey: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function DaySelector({
  weekKey,
  selectedDate,
  onSelectDate,
}: DaySelectorProps) {
  const days = getDaysInWeek(weekKey);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: spacing.sm, marginBottom: spacing.md }}
    >
      {days.map((date, index) => (
        <DayChip
          key={date}
          label={DAY_LABELS[index]}
          date={date}
          selected={date === selectedDate}
          onPress={() => onSelectDate(date)}
        />
      ))}
    </ScrollView>
  );
}
