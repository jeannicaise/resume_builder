import { PhoneIcon } from "@chakra-ui/icons";
import {
  Text,
  Center,
  Heading,
  HStack,
  Stack,
  Link,
  VStack,
  UnorderedList,
  ListItem,
  StackDivider,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import ReactToPrint from "react-to-print";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';



const ResumeTemplateEdit = ({ page }) => {
  const ref = React.useRef(null);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [resumeInfo, setResumeInfo] = useState({
    profile: {},
    competence: {},
    work: [],
    education: [],
  });
  const { user_id } = useParams();
  const { currentUser } = useAuth();

  
  // Fonction pour récupérer les données du CV depuis l'API
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/resume/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}` // Ajouter le token dans l'en-tête
          }
        });        
        setResumeInfo(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error("Erreur lors de la récupération des données du CV:", error);
        toast({
          title: "Erreur lors de la récupération des données du CV.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchResumeData();
  }, [currentUser.id, toast]);
  
  return (
    <>
      <Stack spacing={4} ref={ref} m={6} fontFamily="sans-serif">
        <Stack spacing={1}>
          <Center>
            <Heading as="h1">
              {resumeInfo.profile.firstname} {resumeInfo.profile.lastname}
            </Heading>
          </Center>
          <Center>
            <HStack
              justify="center"
              wrap="wrap"
              divider={<StackDivider borderColor="gray.500" />}
            >
              {resumeInfo.profile.email && (
                <Link
                  href={`mailto:${resumeInfo.profile.email}`}
                  isExternal
                  color="blue.500"
                >
                  {resumeInfo.profile.email}
                </Link>
              )}
              {resumeInfo.profile.linkedin && (
                <Link
                  href={resumeInfo.profile.linkedin}
                  isExternal
                  color="blue.500"
                >
                  Linkedin
                </Link>
              )}
              {resumeInfo.profile.github && (
                <Link
                  href={resumeInfo.profile.github}
                  isExternal
                  color="blue.500"
                >
                  Github
                </Link>
              )}
              {resumeInfo.profile.website && (
                <Link
                  href={resumeInfo.profile.website}
                  isExternal
                  color="blue.500"
                >
                  Portfolio
                </Link>
              )}
            </HStack>
          </Center>
          <HStack justify="center">
            <address>
              <PhoneIcon /> {resumeInfo.profile.phone} &nbsp;
              {resumeInfo.profile.address}
            </address>
          </HStack>
        </Stack>

        {/* SECTION: Summary */}
        <VStack spacing={2} align="stretch"> 
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            SUMMARY
          </Heading>
          <Text>{resumeInfo.competence.summary}</Text>
        </VStack>

        {/* SECTION: Skills */}
        <VStack spacing={4} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            SKILLS
          </Heading>
          <UnorderedList px="20px">
            {resumeInfo.competence.skills &&
              resumeInfo.competence.skills.split("\n").map((s, i) => (
                <ListItem key={i}>{s.trim()}</ListItem>
              ))}
          </UnorderedList>
        </VStack>

        {/* SECTION: Work Experience */}
        {resumeInfo.work && resumeInfo.work.length ? (
          <VStack spacing={4} align="stretch">
            <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
              WORK EXPERIENCE
            </Heading>
            {resumeInfo.work.map((w, i) => (
              <VStack align="stretch" key={i}>
                <HStack justify="space-between" align="baseline">
                  <VStack align="stretch">
                    <Heading as="h5" fontSize="lg">
                      {w.role}
                    </Heading>
                    <Heading as="h5" fontSize="md">
                      {w.company_name}
                    </Heading>
                  </VStack>
                  <Heading as="h6" fontSize="md">
                    {w.work_start_date} &#8212; {w.work_end_date}
                  </Heading>
                </HStack>
                <UnorderedList px="20px">
                  {w.work_description &&
                    w.work_description.split("\n").map((d, i) => (
                      <ListItem key={i}>{d}</ListItem>
                    ))}
                </UnorderedList>
              </VStack>
            ))}
          </VStack>
        ) : null}

        {/* SECTION: Education */}
        <VStack spacing={4} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            EDUCATION
          </Heading>
          {resumeInfo.education.map((e, i) => (
            <HStack justify="space-between" align="baseline" key={i}>
              <VStack align="stretch">
                <Heading as="h5" fontSize="lg">
                  {e.institution_name}
                </Heading>
                <Heading as="h5" fontSize="md">
                  {e.degree}
                </Heading>
              </VStack>
              <Heading as="h6" fontSize="md">
                {e.edu_start_date} &#8212; {e.edu_end_date}
              </Heading>
            </HStack> 
          ))}
        </VStack>
      </Stack>

      {/* Buttons for saving and printing */}
      <HStack divider={<StackDivider />} pt="24px">
       
        <ReactToPrint
          trigger={() => (
            <Button w="max-content" colorScheme="blue" isDisabled={page !== 3}>
              Download PDF
            </Button>
          )}
          content={() => ref.current}
        />
      </HStack>
    </>
  );
};

export default ResumeTemplateEdit;
