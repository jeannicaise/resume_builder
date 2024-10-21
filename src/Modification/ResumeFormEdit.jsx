import { EditIcon } from "@chakra-ui/icons";
import { FiHome, FiLogIn, FiLogOut } from "react-icons/fi"; // Import Home, Login, and Logout icons from react-icons
import {
  Box,
  VStack,
  Center,
  Heading,
  Progress,
  Stack,
  HStack,
  Button
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Hook for navigation
import BasicDetailsEdit from "./BasicDetailsFormEdit";
import EducationDetailsEdit from "./EducationDetailsEdit";
import SummaryAndSkillsEdit from "./SummaryAndSkillsEdit"; // Mise à jour du nom du composant
import WorkExperiencesEdit from "./WorkExperiencesEdit"; // Mise à jour du nom du composant
import ResumeTemplateEdit from "./ResumeTemplateEdit";
import { useAuth } from "../contexts/AuthContext"; // Import du contexte Auth

const ResumeFormEdit = () => {
  const [page, setPage] = useState(0);
  const [isMobile] = useMediaQuery("(max-width: 798px)");
  const { currentUser, logout } = useAuth(); // Récupérer l'utilisateur actuel et la fonction de déconnexion du contexte Auth
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
          <BasicDetailsEdit
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
          />
        );
      case 1:
        return (
          <SummaryAndSkillsEdit
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
          />
        );
      case 2:
        return (
          <WorkExperiencesEdit
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
            setPage={setPage}
          />
        );
      case 3:
        return (
          <EducationDetailsEdit
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

          {/* Afficher Logout si l'utilisateur est connecté, sinon afficher Connexion */}
          {currentUser ? (
            <Button
              leftIcon={<FiLogOut />} // Logout icon
              colorScheme="red"
              variant="solid"
              onClick={() => {
                logout(); // Déconnexion via le contexte Auth
                navigate("/login"); // Redirection vers la page de login après déconnexion
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              leftIcon={<FiLogIn />} // Login icon
              colorScheme="teal"
              variant="solid"
              onClick={() => navigate("/login")} // Redirection vers login
            >
              Connexion
            </Button>
          )}
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
            <ResumeTemplateEdit resumeInfo={resumeInfo} page={page} />
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
            <ResumeTemplateEdit resumeInfo={resumeInfo} page={page} />
          </VStack>
        </HStack>
      )}
    </Stack>
  );
};

export default ResumeFormEdit;
