import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    borderBottomColor: '#E2E8F0',
    minHeight: 30,
  },
  tableCellHeader: {
    width: '50%',
    padding: 8,
    fontWeight: 'bold',
    backgroundColor: '#F7FAFC',
  },
  tableCell: {
    width: '50%',
    padding: 8,
    backgroundColor: '#EDF2F7',
  },
  emptyCell: {
    width: '50%',
    padding: 8,
    backgroundColor: '#EDF2F7',
    color: '#A0AEC0',
    fontStyle: 'italic',
  },
});

/**
 * Formats a response value based on question type
 */
const formatResponseValue = (value, questionType, options) => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  // Handle boolean values
  if (questionType === 'boolean') {
    return value === true || value === 'yes' || value === 'true' ? 'Yes' : 
           value === false || value === 'no' || value === 'false' ? 'No' : String(value);
  }

  // Handle select/dropdown - find label from options
  if (questionType === 'select' && options && Array.isArray(options)) {
    const option = options.find(opt => opt.value === value || opt.value === String(value));
    return option ? option.label : String(value);
  }

  // Handle rating grid
  if (questionType === 'rating_grid' && typeof value === 'object' && value !== null) {
    if (options && options.rows && options.columns) {
      const gridRows = [];
      Object.entries(value).forEach(([key, val]) => {
        const row = options.rows.find(r => r.key === key);
        const column = options.columns.find(c => c.value === val);
        if (row && column) {
          gridRows.push(`${row.label}: ${column.label}`);
        }
      });
      return gridRows.join('\n');
    }
    return JSON.stringify(value);
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  // Handle objects
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }

  return String(value);
};

export default function DynamicFormPDF({ formTitle, questions = [], formData = {} }) {
  // Filter out non-visible questions and sort by display order
  const visibleQuestions = (Array.isArray(questions) ? questions : [])
    .filter(q => q && q.isVisible && q.questionType !== 'text_block' && q.questionType !== 'header')
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{formTitle || 'Form'}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Question</Text>
            <Text style={styles.tableCellHeader}>Answer</Text>
          </View>
          {visibleQuestions.map((question) => {
            // Try both camelCase and snake_case field keys
            const camelKey = question.fieldKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            const value = formData[camelKey] ?? formData[question.fieldKey] ?? null;
            const formattedValue = formatResponseValue(value, question.questionType, question.options);

            return (
              <View style={styles.tableRow} key={question.id || question.fieldKey}>
                <Text style={styles.tableCellHeader}>{question.questionText}</Text>
                <Text style={value === null || value === undefined || value === '' ? styles.emptyCell : styles.tableCell}>
                  {formattedValue}
                </Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}

