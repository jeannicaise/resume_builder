import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, Heading, Text, Container, VStack } from '@chakra-ui/react';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <Container maxW="lg" mt={10}>
      <Box textAlign="center" p={5} shadow="md" borderWidth={1} borderRadius="lg">
        <Heading as="h1" size="2xl" mb={4}>
          Bienvenue sur l'Éditeur de CV
        </Heading>
        {currentUser ? (
          <VStack spacing={4} mt={6}>
            <Button as={Link} to="/creation" colorScheme="teal" size="lg">
              Créer un nouveau CV
            </Button>
            <Button as={Link} to={`/modif/${currentUser.id}`} colorScheme="blue" size="lg">
              Modifier mon CV
            </Button>
          </VStack>
        ) : (
          <VStack spacing={4} mt={6}>
            <Text fontSize="lg">
            </Text>
            <Button as={Link} to="/creation" colorScheme="teal" size="lg">
              Créer un CV sans sauvegarde
            </Button>
          
            <Button as={Link} to="/register" colorScheme="teal" size="lg">
              Créer un CV avec sauvegarde
            </Button>
          </VStack>
        )}
      </Box>
    </Container>
  );
};

export default Home;
