import {Button} from "@chakra-ui/react";

const CSVButton = ( { data } ) => {

   
    const header = [
        "age",
        "attendingSchoolUponEntry",
        "attendingSchoolUponExit",
        "bedNights",
        "bedNightsChildren",
        "chronicallyHomeless",
        "cityOfLastPermanentResidence",
        "createdBy",
        "dateOfBirth",
        "destinationCity",
        "disabledChildren",
        "email",
        "emergencyContactName",
        "emergencyContactPhoneNumber",
        "employementGained",
        "entranceDate",
        "estimatedExitDate",
        "ethnicity",
        "exitDate",
        "firstName",
        "grant",
        "homelessnessLength",
        "id",
        "lastName",
        "medical",
        "phoneNumber",
        "pregnantUponEntry",
        "priorLiving",
        "priorLivingCity",
        "race",
        "reasonForLeaving",
        "reunified",
        "savingsAmount",
        "shelterInLastFiveYears",
        "specificDestination",
        "specificReasonForLeaving",
        "status",
        "successfulCompletion",
        "unitId"
    ];
    
    
    const convertToCSV = (headers, objArray) => {
        const csvRows = [];
        csvRows.push(headers.join(","));
        console.log(csvRows);
        data.forEach(row => {
            console.log(row);
            const values = headers.map(header => {
                console.log(row[header]);
                //const escaped = ('' + row[header]).replace(/"/g, '\\"'); // Escape double quotes
                return `${row[header]}`; // Encapsulate in quotes to handle commas in data
            });
            console.log(values);
            csvRows.push(values.join(','));
        });
        console.log(csvRows);
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
    
    
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv'; // Name of the file to download
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link); // Clean up
    }

    return (
        <>
            <Button colorScheme="blue" onClick={() => convertToCSV(header, data)}>
                Download CSV
            </Button>
        </>
    );

}
export default CSVButton;