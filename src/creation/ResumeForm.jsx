import { EditIcon } from "@chakra-ui/icons";
import { FiHome, FiLogIn } from "react-icons/fi"; // Import Home and Login icons from react-icons
import {
  Box,
  VStack,
  Center,
  Heading,
  Progress,
  Stack,
  HStack,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Hook for navigation
import BasicDetails from "./BasicDetailsForm";
import EducationDetails from "./EducationDetails";
import SummaryAndSkills from "./SummaryAndSkills";
import WorkExperiences from "./WorkExperiences";
import ResumeTemplate from "./ResumeTemplate";

const ResumeForm = () => {
  const [page, setPage] = useState(0);
  const [isMobile] = useMediaQuery("(max-width: 798px)");
  const navigate = useNavigate(); // Hook for navigation

  const initialState = {
    profile: {
      user_id: "",
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      linkedin: "",
      github: "",
      website: "",
      address: "",
    },
    competence: {
      summary: "",
      skills: "",
    },
    work: [],
    education: [],
  };

  const [resumeInfo, setResumeInfo] = useState(initialState);

  const formPage = [
    "Profile Details",
    "Summary and Skills",
    "Work Experiences",
    "Educational Details",
  ];

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
          <SummaryAndSkills
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
          />
        );
      case 2:
        return (
          <WorkExperiences
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
          />
        );
      case 3:
        return (
          <EducationDetails
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack mb="50px">
      <Center
        style={{ display: page === 4 ? "none" : "flex" }}
        w="100%"
        px="12px"
        flexDir="column"
      >
        <HStack w="60%" justify="space-between" p={4}>
          {/* Button to navigate home with icon and text */}
          <Button
            leftIcon={<FiHome />} // Adding icon next to text
            colorScheme="teal"
            variant="solid"
            onClick={() => navigate("/")} // Redirection to home
          >
            Home
          </Button>
          <Heading p={4}>
            Build Your Resume <EditIcon boxSize={8} />
          </Heading>
          {/* Button to navigate to login page with icon and text */}
          <Button
            leftIcon={<FiLogIn />} // Adding login icon next to text
            colorScheme="teal"
            variant="solid"
            onClick={() => navigate("/login")} // Redirection to login
          >
            Connexion
          </Button>
        </HStack>
        <Box w="60%" borderRadius="lg">
          <Progress colorScheme="whatsapp" value={(page + 1) * 25} />
        </Box>
      </Center>

      {isMobile ? (
        <HStack p={4} spacing={3} justify="center">
          <VStack
            justify="center"
            spacing={4}
            width="90%"
            style={{ display: page === 4 ? "none" : "block" }}
          >
            <Box
              p={8}
              borderRadius="lg"
              bg="gray.900"
              color="white"
              boxShadow="xl"
              rounded="md"
            >
              <Center>
                <Heading mb={4}>{formPage[page]}</Heading>
              </Center>
              {renderForm()}
            </Box>
          </VStack>
          <VStack style={{ display: page === 4 ? "block" : "none" }}>
            <ResumeTemplate resumeInfo={resumeInfo} page={page} />
          </VStack>
        </HStack>
      ) : (
        <HStack p={4} spacing={3} align="stretch" justify="center">
          <VStack
            justify="center"
            spacing={4}
            width="50%"
            style={{ display: page === 4 ? "none" : "block" }}
          >
            <Box
              p={8}
              borderRadius="lg"
              bg="gray.900"
              color="white"
              boxShadow="xl"
              rounded="md"
            >
              <Center>
                <Heading mb={4}>{formPage[page]}</Heading>
              </Center>
              {renderForm()}
            </Box>
          </VStack>
          <VStack style={{ width: page === 4 ? "80%" : "50%" }}>
            <ResumeTemplate resumeInfo={resumeInfo} page={page} />
          </VStack>
        </HStack>
      )}
    </Stack>
  );
};

export default ResumeForm;
