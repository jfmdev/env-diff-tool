// Merge rules:

// Variable has non-empty values in both files → Use the value from:
// - First file
// - Second file

// Variable is empty in the first file but not in the second →
// - Keep it empty
// - Use the value from the second file

// Variable exists only in the second file →
// - Omit it
// - Include it

// [ ] Sort merged variables alphabetically
// [ ] Remove empty variables

export function Merge() {
  return (
    <div>
      <h2>Merge</h2>
    </div>
  );
}
