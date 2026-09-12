import { FC, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/core/contexts/theme.context";

interface DueDatePickerProps {
  /** Fecha y hora límite en formato ISO 8601, o undefined si no tiene. */
  value?: string;
  onChange: (isoDate: string | undefined) => void;
  disabled?: boolean;
}

const formatValue = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const DueDatePicker: FC<DueDatePickerProps> = ({ value, onChange, disabled }) => {
  const { palette } = useThemeContext();
  const [pickerStep, setPickerStep] = useState<"none" | "date" | "time">("none");
  // Valor en edición mientras se elige fecha y luego hora (Android muestra
  // los dos selectores por separado; iOS los combina en un solo modal).
  const [draft, setDraft] = useState<Date>(value ? new Date(value) : new Date());

  const openPicker = () => {
    setDraft(value ? new Date(value) : new Date());
    setPickerStep("date");
  };

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type === "dismissed") {
      setPickerStep("none");
      return;
    }
    if (!selected) return;

    if (pickerStep === "date") {
      // Primero se elige la fecha; al confirmar se abre el selector de hora.
      setDraft(selected);
      setPickerStep("time");
      return;
    }

    setDraft(selected);
    setPickerStep("none");
    onChange(selected.toISOString());
  };

  const clearDueDate = () => onChange(undefined);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={openPicker}
        disabled={disabled}
        style={[styles.field, { borderColor: palette.colors.border, backgroundColor: palette.colors.surface }]}
      >
        <Ionicons name="alarm-outline" size={20} color={palette.texts.tertiary} />
        <Text style={{ color: value ? palette.texts.primary : palette.texts.tertiary, flex: 1 }}>
          {value ? formatValue(value) : "Sin fecha límite (opcional)"}
        </Text>
        {!!value && (
          <Pressable onPress={clearDueDate} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color={palette.texts.tertiary} />
          </Pressable>
        )}
      </Pressable>

      {pickerStep === "date" && (
        <DateTimePicker value={draft} mode="date" minimumDate={new Date()} onChange={handleChange} />
      )}

      {pickerStep === "time" && (
        <DateTimePicker value={draft} mode="time" onChange={handleChange} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 8 },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
});
