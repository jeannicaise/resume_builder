import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  VStack,
  Center,
  Heading,
  Progress,
  Stack,
  HStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import BasicDetails from "./BasicDetailsForm";
import EduacationDetails from "./EducationDetails";
import ProfessionalDetails from "./ProfessionalDetailsForm";
import ResumeTemplate from "../components/CVTemplate";

const ResumeForm = () => {
  const [page, setPage] = React.useState(0);

  const initialState = {
    profile: {
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      linkedin: "",
      github: "",
      website: "",
      address: "",
    },
    professional: {
      summary: "",
      skills: "",
      work: [],
    },
    education: [],
    certification: [],
  };

  const [resumeInfo, setResumeInfo] = useState(initialState);

  const formPage = [
    "Profile Details",
    "Professional Experience",
    "Educational Details",
  ];

  console.log(resumeInfo);
  

  const renderForm = () => {
    switch (page) {
      case 0:
        return (
          <BasicDetails
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
            
          />
        );
      case 1:
        return (
          <ProfessionalDetails
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
          />
        );
      case 2:
        return (
          <EduacationDetails
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
          />
        );
      default:
        return;
    }
  };
return (
  <Stack mb="50px">
    <Center
      style={{ display: "flex" }}
      w="100%"
      px="12px"
      flexDir="column"  backgroundColor={"blue"} 
    >
      {/* Entete */}
      <Heading p={10}  backgroundColor={"black"} >
        Construis ton CV <EditIcon boxSize={8} />
      </Heading>


      {/* Barre de progression  */}
      <Box w="60%" borderRadius="lg">
        <Progress
          colorScheme="whatsapp"
          value={page === 0 ? 33.3 : page === 1 ? 66.6 : 100}
         />
      </Box>

    </Center>

    <HStack p={4} spacing={3} align="stretch" justify="center" backgroundColor={"red"}>
      <VStack
        justify="center"
        spacing={4}
        width="50%"
        
        >
        <Box
          p={8}
          borderRadius="lg"
          bg="gray.900"
          color="white"
          boxShadow="xl"
          rounded="md"
          backgroundColor={"yellow"} 
        >
          <Center backgroundColor={"green"} >
            <Heading backgroundColor={"black"}  mb={4}>{formPage[page]}</Heading>
          </Center>
          {renderForm()}
        </Box>
          
      </VStack>
      
      <VStack backgroundColor={"green"} style={{ width:  "50%" }}>
        <ResumeTemplate resumeInfo={resumeInfo} page={page} />
      </VStack>
    </HStack>
  </Stack>
);

};

export default ResumeForm;
