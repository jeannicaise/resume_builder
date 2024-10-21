import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, FormControl, FormLabel, Input, Heading, Container, VStack, Text, HStack } from '@chakra-ui/react';
import { FiHome } from "react-icons/fi"; // Importing the Home icon

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate(`/modif/${currentUser.id}`);
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
    }
  };

  return (
    <Container maxW="lg" mt={10}>
      <Box textAlign="center" p={5} shadow="md" borderWidth={1} borderRadius="lg">
        <HStack justify="space-between" mb={4}>
          {/* Home button with icon */}
          <Button
            leftIcon={<FiHome />}
            colorScheme="teal"
            variant="solid"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Heading as="h2" size="xl">
            Connexion
          </Heading>
        </HStack>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="username" isRequired>
              <FormLabel>Nom d'utilisateur</FormLabel>
              <Input
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="flushed"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Mot de passe</FormLabel>
              <Input
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="flushed"
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" size="lg">
              Se connecter
            </Button>
          </VStack>
        </form>
        <Text mt={4}>
          Pas encore de compte?{' '}
          <Button variant="link" colorScheme="blue" onClick={() => navigate('/register')}>
            Créer un compte
          </Button>
        </Text>
      </Box>
    </Container>
  );
};

export default Login;
