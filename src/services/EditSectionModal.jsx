
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading
} from "@chakra-ui/react";
import axios from 'axios';

const EditSectionModal = ({ isOpen, onClose, currentSection, sectionData, userId, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(sectionData || {});
  }, [sectionData]);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (Array.isArray(formData)) {
      if (currentSection === 'professional.skills' || currentSection === 'professional.summary') {
        // For skills and summary, update the entire array
        setFormData(value.split('\n').filter(item => item.trim() !== ''));
      } else {
        const newFormData = [...formData];
        newFormData[index] = { ...newFormData[index], [name]: value };
        setFormData(newFormData);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const saveChanges = async () => {
    try {
      let dataToSave = formData;
      let endpoint = currentSection;
  
      // Ajuster l'endpoint en fonction de la section
      if (currentSection === 'professional.skills') {
        endpoint = 'skills';
        dataToSave = { skills: formData.join('\n') };
      } else if (currentSection === 'professional.summary') {
        endpoint = 'summary';
        dataToSave = { summary: formData.join('\n') };
      } else if (currentSection === 'professional.work_experience') {
        endpoint = 'work';
        // Assurez-vous que les noms de champs correspondent à ce que le backend attend
        dataToSave = {
          role: formData.role,
          company_name: formData.company_name,
          work_start_date: formData.work_start_date,
          work_end_date: formData.work_end_date,
          description: formData.description
        };
      } else if (currentSection === 'education') {
        endpoint = 'education';
        // Assurez-vous que les noms de champs correspondent à ce que le backend attend
        dataToSave = {
            institution_name: formData.institution_name,
          degree: formData.degree,
          edu_start_date: formData.edu_start_date,
          edu_end_date: formData.edu_end_date
        };
      }
  
      const response = await axios.put(`http://localhost:5001/resume/${userId}/${endpoint}`, dataToSave);
      onSave(formData);
      onClose();
      console.log(dataToSave);
      
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const renderFormFields = () => {
    if (currentSection === 'professional.skills'||currentSection === 'professional.summary') {
      return (
        <FormControl>
          <FormLabel>Skills (one per line)</FormLabel>
          <Textarea
            value={Array.isArray(formData) ? formData.join('\n') : formData}
            onChange={(e) => handleChange(e)}
            rows={10}
          />
        </FormControl>
      );
    } else if (Array.isArray(formData)) {
      return formData.map((item, index) => (
        <VStack key={index} spacing={4} align="stretch">
          <Heading as="h4" size="md">Item {index + 1}</Heading>
          {Object.entries(item).map(([key, value]) => renderField(key, value, index))}
        </VStack>
      ));
    } else {
      return Object.entries(formData).map(([key, value]) => renderField(key, value));
    }
  };

  const renderField = (key, value, index = null) => {
    const isTextArea = ['description'].includes(key);
    const Component = isTextArea ? Textarea : Input;
    
    return (
      <FormControl key={index !== null ? `${index}-${key}` : key}>
        <FormLabel>{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</FormLabel>
        <Component
          name={key}
          value={value || ""}
          onChange={(e) => handleChange(e, index)}
        />
      </FormControl>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit {currentSection.split('.').pop()}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {renderFormFields()}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={saveChanges}>
            Save Changes
          </Button>
          <Button variant="ghost" onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditSectionModal;