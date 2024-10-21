import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  SimpleGrid,
  Stack,
  FormControl,
  Input,
  HStack,
  FormHelperText,
  useToast
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';

const EducationDetails = (props) => {
  const { resumeInfo, setResumeInfo, setPage } = props;
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Si il n'y a pas d'éléments dans la section éducation, on en ajoute un
    if (resumeInfo.education.length === 0) {
      createEducationSection();
    }
  }, [resumeInfo.education.length]);

  const createEducationSection = () => {
    const updatedEducation = [
      ...resumeInfo.education,
      { college: "", course: "", startDate: "", endDate: "" }
    ];
    setResumeInfo({ ...resumeInfo, education: updatedEducation });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...resumeInfo.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setResumeInfo({ ...resumeInfo, education: updatedEducation });
  };

  const educationForm = (index, educationData) => (
    <SimpleGrid spacing={4} columns={[1, 1, 1, 2]} key={index}>
      <FormControl>
        <FormLabel>College/University or School:</FormLabel>
        <Input
          type="text"
          placeholder="school, college or university name"
          value={educationData.college}
          onChange={(e) => handleEducationChange(index, "college", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Course/Degree or Graduation:</FormLabel>
        <Input
          type="text"
          placeholder="Bachelors, Masters or High school diploma"
          value={educationData.course}
          onChange={(e) => handleEducationChange(index, "course", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Start date:</FormLabel>
        <Input
          type="text"
          placeholder="Enter start date or year jan 2022"
          value={educationData.startDate}
          onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>End date:</FormLabel>
        <Input
          type="text"
          placeholder="Enter end date or year march 2022"
          value={educationData.endDate}
          onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
        />
        <FormHelperText>write present if ongoing</FormHelperText>
      </FormControl>
    </SimpleGrid>
  );

  return (
    <Stack>
      {/* Render Education sections */}
      {resumeInfo.education.map((edu, index) => educationForm(index, edu))}
      <Button
        colorScheme="whatsapp"
        onClick={createEducationSection}
        w="max-content"
        rightIcon={<AddIcon />}
      >
        Add Education
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
          onClick={() => setPage((p) => p + 1)}
          rightIcon={<ChevronRightIcon />}
        >
          Next Section
        </Button>
      </HStack>
    </Stack>
  );
};

export default EducationDetails;
