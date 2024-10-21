import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormHelperText, FormLabel, GridItem, HStack, Input, SimpleGrid, Stack, Textarea, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";


const WorkExperiences = ({ resumeInfo, setResumeInfo, setPage }) => {


   useEffect(() => {
    if (resumeInfo.work.length === 0) {
      createWorkSection();
    }
  }, [ resumeInfo.work.length]);

  const handleWorkChange = (index, field, value) => {
    const updatedWork = [...resumeInfo.work];
    updatedWork[index] = { ...updatedWork[index], [field]: value };
    setResumeInfo({ ...resumeInfo, work: updatedWork });
  };
  
  const createWorkSection = () => {
    const updatedWork = [...resumeInfo.work, { jobTitle: "", company: "", startDate: "", endDate: "", jobDetails: "" }];
    setResumeInfo({ ...resumeInfo, work: updatedWork });
  };
  

  
  const workExperienceForm = (index, workData) => (
    <SimpleGrid spacing={4} columns={[1, 1, 1, 2]} key={index}>
      <FormControl>
        <FormLabel>Job Title:</FormLabel>
        <Input
          type="text"
          placeholder="Software developer"
          value={workData.jobTitle}
          onChange={(e) => handleWorkChange(index, "jobTitle", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Company/Employer:</FormLabel>
        <Input
          type="text"
          placeholder="Employer(Company) name"
          value={workData.company}
          onChange={(e) => handleWorkChange(index, "company", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Start date:</FormLabel>
        <Input
          type="text"
          placeholder="Enter start date jan 2022"
          value={workData.startDate}
          onChange={(e) => handleWorkChange(index, "startDate", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>End date:</FormLabel>
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
      {/* Render Work Experience sections */}
      {resumeInfo.work.map((work, index) =>
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
          colorScheme="blue"
          onClick={() => setPage((p) => p - 1)}
          leftIcon={<ChevronLeftIcon />}
        >
          Back
        </Button>
        <Button
          colorScheme="whatsapp"
          rightIcon={<ChevronRightIcon />}
          onClick={() => setPage((p) => p + 1)}
        >
          Next Section
        </Button>
      </HStack>
    </Stack>
  );
};

export default WorkExperiences;
