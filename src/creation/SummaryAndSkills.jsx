import { FormControl, FormHelperText, FormLabel, Textarea, Stack, Button, HStack, useToast } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React from "react";


const SummaryAndSkills = ({ resumeInfo, setResumeInfo, setPage }) => {

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Summary:</FormLabel>
        <Textarea
          placeholder="Introduce yourself by pitching your skills & explaining how they can be of value to a company"
          value={resumeInfo.competence.summary}
          onChange={(e) => {
            const updatedValue = {
              ...resumeInfo.competence,
              summary: e.target.value,
            };
            setResumeInfo({ ...resumeInfo, competence: updatedValue });
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Skills:</FormLabel>
        <Textarea
          placeholder="Communication, Teambuilding, etc."
          value={resumeInfo.competence.skills}
          onChange={(e) => {
            const updatedValue = {
              ...resumeInfo.competence,
              skills: e.target.value,
            };
            setResumeInfo({ ...resumeInfo, competence: updatedValue });
          }}
        />
        <FormHelperText>Hit enter for newline</FormHelperText>
      </FormControl>

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

export default SummaryAndSkills;
