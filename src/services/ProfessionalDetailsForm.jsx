import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  GridItem,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";


const ProfessionalDetails = (props) => {
  const { resumeInfo, setResumeInfo, setPage, userId } = props;
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleWorkChange = (index, field, value) => {
    const updatedWork = [...resumeInfo.professional.work];
    updatedWork[index] = { ...updatedWork[index], [field]: value };
    const updatedResumeInfo = {
      ...resumeInfo,
      professional: { ...resumeInfo.professional, work: updatedWork },
    };
    setResumeInfo(updatedResumeInfo);
  };

  const createWorkSection = () => {
    const updatedWork = [...resumeInfo.professional.work, { jobTitle: "", company: "", startDate: "", endDate: "", jobDetails: "" }];
    const updatedResumeInfo = {
      ...resumeInfo,
      professional: { ...resumeInfo.professional, work: updatedWork },
    };
    setResumeInfo(updatedResumeInfo);
  };

  const saveWorkExperience = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:5001/resume/13/experience`, {
        workExperience: resumeInfo.professional.work,
      });

      toast({
        title: "Expérience professionnelle sauvegardée avec succès !",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des expériences professionnelles:", error);
      toast({
        title: "Erreur lors de la sauvegarde des expériences professionnelles.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const workExperienceForm = (index, workData) => (
    <SimpleGrid spacing={4} columns={[1, 1, 1, 2]} key={index}>
      <FormControl>
        <FormLabel>Job Title: </FormLabel>
        <Input
          type="text"
          placeholder="Software developer"
          value={workData.jobTitle}
          onChange={(e) => handleWorkChange(index, "jobTitle", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Company/Employer: </FormLabel>
        <Input
          type="text"
          placeholder="Employer(Company) name"
          value={workData.company}
          onChange={(e) => handleWorkChange(index, "company", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Start date: </FormLabel>
        <Input
          type="text"
          placeholder="Enter start date jan 2022"
          value={workData.startDate}
          onChange={(e) => handleWorkChange(index, "startDate", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>End date: </FormLabel>
        <Input
          type="text"
          placeholder="Enter end date jan 2023"
          value={workData.endDate}
          onChange={(e) => handleWorkChange(index, "endDate", e.target.value)}
        />
        <FormHelperText>write present if ongoing</FormHelperText>
      </FormControl>
      <GridItem colSpan={[1, 1, 1, 2]}>
        <FormControl>
          <FormLabel>Job Details:</FormLabel>
          <Textarea
            placeholder="Describe your role and achievements"
            value={workData.jobDetails}
            onChange={(e) => handleWorkChange(index, "jobDetails", e.target.value)}
          />
          <FormHelperText>Hit enter for newline</FormHelperText>
        </FormControl>
      </GridItem>
    </SimpleGrid>
  );

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Summary:</FormLabel>
        <Textarea
          placeholder="Introduce yourself by pitching your skills & explaining how they can be of value to a company"
          value={resumeInfo.professional.summary}
          onChange={(e) => {
            const updatedValue = {
              ...resumeInfo.professional,
              summary: e.target.value,
            };
            const updatedResumeInfo = {
              ...resumeInfo,
              professional: updatedValue,
            };
            setResumeInfo(updatedResumeInfo);
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Skills:</FormLabel>
        <Textarea
          placeholder="Communication, Teambuilding, etc.."
          value={resumeInfo.professional.skills}
          onChange={(e) => {
            const updatedValue = {
              ...resumeInfo.professional,
              skills: e.target.value,
            };
            const updatedResumeInfo = {
              ...resumeInfo,
              professional: updatedValue,
            };
            setResumeInfo(updatedResumeInfo);
          }}
        />
        <FormHelperText>Hit enter for newline</FormHelperText>
      </FormControl>

      {/* Render Work Experience sections */}
      {resumeInfo.professional.work.map((work, index) =>
        workExperienceForm(index, work)
      )}

      <Button
        colorScheme="messenger"
        onClick={createWorkSection}
        w="max-content"
        rightIcon={<AddIcon />}
      >
        Add Work Experience
      </Button>

      <HStack spacing={8} justify="center">
        <Button
          colorScheme="whatsapp"
          onClick={saveWorkExperience}
          isLoading={loading}
        >
          Save Work Experience
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => {
            setPage((p) => p - 1);
          }}
          leftIcon={<ChevronLeftIcon />}
        >
          Back
        </Button>
        <Button
          colorScheme="whatsapp"
          rightIcon={<ChevronRightIcon />}
          onClick={() => {
            setPage((p) => p + 1);
          }}
        >
          Next Section
        </Button>
      </HStack>
    </Stack>
  );
};

export default ProfessionalDetails;
