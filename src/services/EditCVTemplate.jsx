
import React, { useEffect, useState } from "react";
import { PhoneIcon, EditIcon } from "@chakra-ui/icons";
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
  IconButton,
} from "@chakra-ui/react";
import ReactToPrint from "react-to-print";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import EditSectionModal from './EditSectionModal';

const CVTemplate = () => {
  const [resumeInfo, setResumeInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [sectionData, setSectionData] = useState({});
  const ref = React.useRef(null);
  const { user_id } = useParams();

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/resume/${user_id}`);
        setResumeInfo(response.data);
      } catch (error) {
        console.error("Error fetching resume data:", error);
        setError("Failed to load resume data. Please try again later.");
      }
    };

    fetchResumeData();
  }, [user_id]);

  const handleEditClick = (section) => {
    let data;
    const [mainSection, subSection] = section.split('.');
    
    if (subSection) {
      data = resumeInfo[mainSection][subSection];
      if (subSection === 'skills' || subSection === 'summary') {
        data = data.split('\n').filter(item => item.trim() !== '');
      }
    } else {
      data = resumeInfo[section];
    }
  
    setCurrentSection(section);
    setSectionData(data);
    setIsOpen(true);
  };

  const handleSave = (updatedData) => {
    const [mainSection, subSection] = currentSection.split('.');
    
    setResumeInfo(prevState => {
      const newState = { ...prevState };
      if (subSection) {
        // If it's the skills section, join the array back into a string
        if (subSection === ('skills'|| subSection ==='summary') && Array.isArray(updatedData)) {
            updatedData = updatedData.join('\n');
          }
        newState[mainSection] = {
          ...newState[mainSection],
          [subSection]: updatedData
        };
      } else {
        newState[mainSection] = updatedData;
      }
      return newState;
    });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!resumeInfo) {
    return <div>Loading...</div>;
  }

  const splitAndFilter = (str) => (str ? str.split("\n").filter(Boolean) : []);

  return (
    <Stack spacing={4} ref={ref} m={6} fontFamily="sans-serif">
      {/* Profile Section */}
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
              <Link href={`mailto:${resumeInfo.profile.email}`} isExternal color="blue.500">
                {resumeInfo.profile.email}
              </Link>
            )}
            {resumeInfo.profile.linkedin && (
              <Link href={resumeInfo.profile.linkedin} isExternal color="blue.500">
                Linkedin
              </Link>
            )}
            {resumeInfo.profile.github && (
              <Link href={resumeInfo.profile.github} isExternal color="blue.500">
                Github
              </Link>
            )}
            {resumeInfo.profile.website && (
              <Link href={resumeInfo.profile.website} isExternal color="blue.500">
                Portfolio
              </Link>
            )}
          </HStack>
        </Center>
        <HStack justify="center">
          <address>
            {resumeInfo.profile.phone && <><PhoneIcon /> {resumeInfo.profile.phone} &nbsp;</>}
            {resumeInfo.profile.address}
          </address>
          <IconButton
            icon={<EditIcon />}
            onClick={() => handleEditClick('profile')}
            aria-label="Edit Profile"
          />
        </HStack>
      </Stack>

      {/* Summary Section */}
      {resumeInfo.professional.summary && (
        <VStack spacing={2} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            SUMMARY
            <IconButton
              icon={<EditIcon />}
              onClick={() => handleEditClick('professional.summary')}
              aria-label="Edit Summary"
              size="sm"
              ml={2}
            />
          </Heading>
          <Text>{resumeInfo.professional.summary}</Text>
        </VStack>
      )}

      {/* Skills Section */}
      {resumeInfo.professional.skills && (
        <VStack spacing={4} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            SKILLS
            <IconButton
              icon={<EditIcon />}
              onClick={() => handleEditClick('professional.skills')}
              aria-label="Edit Skills"
              size="sm"
              ml={2}
            />
          </Heading>
          <UnorderedList px="20px">
            {splitAndFilter(resumeInfo.professional.skills).map((s, i) => (
              <ListItem key={i}>{s.trim()}</ListItem>
            ))}
          </UnorderedList>
        </VStack>
      )}

      {/* Work Experience Section */}
      {resumeInfo.professional.work_experience && resumeInfo.professional.work_experience.length > 0 && (
        <VStack spacing={4} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            WORK EXPERIENCE
            <IconButton
              icon={<EditIcon />}
              onClick={() => handleEditClick('professional.work_experience')}
              aria-label="Edit Work Experience"
              size="sm"
              ml={2}
            />
          </Heading>
          {resumeInfo.professional.work_experience.map((w, i) => (
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
                {splitAndFilter(w.description).map((d, i) => (
                  <ListItem key={i}>{d}</ListItem>
                ))}
              </UnorderedList>
            </VStack>
          ))}
        </VStack>
      )}

      {/* Education Section */}
      {resumeInfo.education && resumeInfo.education.length > 0 && (
        <VStack spacing={4} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            EDUCATION
            <IconButton
              icon={<EditIcon />}
              onClick={() => handleEditClick('education')}
              aria-label="Edit Education"
              size="sm"
              ml={2}
            />
          </Heading>
          {resumeInfo.education.map((e, i) => (
            <HStack justify="space-between" align="baseline" key={i}>
              <VStack align="stretch">
                <Heading as="h5" fontSize="lg">
                  {e.degree}
                </Heading>
                <Heading as="h5" fontSize="md">
                  {e.institution_name}
                </Heading>
              </VStack>
              <Heading as="h6" fontSize="md">
                {e.edu_start_date} &#8212; {e.edu_end_date}
              </Heading>
            </HStack>
          ))}
        </VStack>
      )}

      {/* Certifications Section */}
      {resumeInfo.certifications && resumeInfo.certifications.length > 0 && (
        <VStack spacing={4} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            CERTIFICATIONS
            <IconButton
              icon={<EditIcon />}
              onClick={() => handleEditClick('certifications')}
              aria-label="Edit Certifications"
              size="sm"
              ml={2}
            />
          </Heading>
          {resumeInfo.certifications.map((c, i) => (
            <HStack justify="space-between" align="baseline" key={i}>
              <Link href={c.cert_link} isExternal color="blue.500">
                {c.cert_details}
              </Link>
            </HStack>
          ))}
        </VStack>
      )}

      {/* Print Button */}
      <Center mt={4}>
        <ReactToPrint
          trigger={() => <Button colorScheme="teal">Print CV</Button>}
          content={() => ref.current}
        />
      </Center>

      {/* Modal for Editing Section */}
      <EditSectionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentSection={currentSection}
        sectionData={sectionData}
        userId={user_id}
        onSave={handleSave}
      />
    </Stack>
  );
};

export default CVTemplate;