
import { PhoneIcon } from "@chakra-ui/icons";
import {
  Text,Center,Heading,HStack,Stack,Link,VStack,UnorderedList,ListItem,StackDivider,Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ReactToPrint from "react-to-print";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CVTemplate = () => {
  // Récupérer user_id à partir de profile
  
  const [resumeInfo, setResumeInfo] = useState(null);
  const [error, setError] = useState(null);
  const ref = React.useRef(null);
  const { user_id } = useParams();
  

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/resume/${user_id}`);
        const data = response.data;

        const formattedData = {
          profile: {
            firstname: data.profile.firstname || '',
            lastname: data.profile.lastname || '',
            phone: data.profile.phone || '',
            email: data.profile.email || '',
            linkedin: data.profile.linkedin || '',
            github: data.profile.github || '',
            website: data.profile.website || '',
            address: data.profile.address || '',
          },
          professional: {
            summary: data.professional.summary || '',
            skills: data.professional.skills || '',
            work: (data.professional.work_experience || []).map((item) => ({
              jobTitle: item.role || '',
              company: item.company_name || '',
              startDate: item.work_start_date || '',
              endDate: item.work_end_date || '',
              jobDetails: item.description || '',
            })),
          },
          education: (data.education || []).map((item) => ({
            college: item.institution_name || '',
            course: item.degree || '',
            startDate: item.edu_start_date || '',
            endDate: item.edu_end_date || '',
          })),
          certification: (data.certifications || []).map((item) => ({
            link: item.cert_link || '',
            details: item.cert_details || '',
          })),
        };
        
        setResumeInfo(formattedData);

        
      } catch (error) {
        console.error("Error fetching resume data:", error);
        setError("Failed to load resume data. Please try again later.");
      }
    };

    fetchResumeData();
  }, [user_id]);

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
        </HStack>
      </Stack>

      {/* Summary Section */}
      {resumeInfo.professional.summary && (
        <VStack spacing={2} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            SUMMARY
          </Heading>
          <Text>{resumeInfo.professional.summary}</Text>
        </VStack>
      )}

      {/* Skills Section */}
      {resumeInfo.professional.skills && (
        <VStack spacing={4} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            SKILLS
          </Heading>
          <UnorderedList px="20px">
            {splitAndFilter(resumeInfo.professional.skills).map((s, i) => (
              <ListItem key={i}>{s.trim()}</ListItem>
            ))}
          </UnorderedList>
        </VStack>
      )}

      {/* Work Experience Section */}
      {resumeInfo.professional.work.length > 0 && (
        <VStack spacing={4} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            WORK EXPERIENCE
          </Heading>
          {resumeInfo.professional.work.map((w, i) => (
            <VStack align="stretch" key={i}>
              <HStack justify="space-between" align="baseline">
                <VStack align="stretch">
                  <Heading as="h5" fontSize="lg">
                    {w.jobTitle}
                  </Heading>
                  <Heading as="h5" fontSize="md">
                    {w.company}
                  </Heading>
                </VStack>
                <Heading as="h6" fontSize="md">
                  {w.startDate} &#8212; {w.endDate}
                </Heading>
              </HStack>
              <UnorderedList px="20px">
                {splitAndFilter(w.jobDetails).map((d, i) => (
                  <ListItem key={i}>{d}</ListItem>
                ))}
              </UnorderedList>
            </VStack>
          ))}
        </VStack>
      )}

      {/* Education Section */}
      {resumeInfo.education.length > 0 && (
        <VStack spacing={4} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            EDUCATION
          </Heading>
          {resumeInfo.education.map((e, i) => (
            <HStack justify="space-between" align="baseline" key={i}>
              <VStack align="stretch">
                <Heading as="h5" fontSize="lg">
                  {e.course}
                </Heading>
                <Heading as="h5" fontSize="md">
                  {e.college}
                </Heading>
              </VStack>
              <Heading as="h6" fontSize="md">
                {e.startDate} &#8212; {e.endDate}
              </Heading>
            </HStack>
          ))}
        </VStack>
      )}

      {/* Certifications Section */}
      {resumeInfo.certification.length > 0 && (
        <VStack spacing={4} align="stretch">
          <Heading as="h3" fontSize="xl" borderBottomWidth="1px">
            CERTIFICATIONS
          </Heading> 
          {resumeInfo.certification.map((c, i) => (
            <HStack justify="space-between" align="baseline" key={i}>
              <Link href={c.link} isExternal color="blue.500">
                {c.details}
              </Link>
            </HStack>
          ))}
        </VStack>
      )}

      <ReactToPrint
        trigger={() => <Button colorScheme="teal">Print</Button>}
        content={() => ref.current}
      />
    </Stack>
  );
};

export default CVTemplate;