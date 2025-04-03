import { Button, Text } from "@chakra-ui/react";
import { Navbar } from "../components/Navbar";

export const Playground = () => {
  return (
    <>

        <Button bg={"brand.Blue 500"}></Button>
        <Button bg={"brand.Blue 50"}></Button>
        <Button bg={"brand.Blue 100"}></Button>
        <Button bg={"brand.Blue 300"}></Button>
        <Button bg={"brand.Blue 400"}></Button>
        <Button bg={"brand.Blue 600"}></Button>
        <Button bg={"brand.Blue 700"}></Button>
        <Button bg={"brand.Blue 900"}></Button>

        <Button variant='primary'>Upload</Button> 
        <Button variant='secondary'>Upload</Button> 
        <Button variant='tertiary'>Upload</Button> 
        <Button variant='delete'>Upload</Button> 

        <Text variant={"h1"}>testing</Text>
        <Text variant={"h2"}>testing</Text>
        <Text variant={"h3"}>testing</Text>
        <Text variant={"h4"}>testing</Text>
        <Text variant={"h5"}>testing</Text>
        <Text variant={"body"}>testing</Text>
    
    </>
    
  );
};
