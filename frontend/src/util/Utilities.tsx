import { Technique, Hierarchy, Gi, Collection, CollectionWithoutTechniquesOrId, CollectionTechnique, Role } from "common";
import { User as Auth0User } from '@auth0/auth0-react'


const API_SERVER_URL = process.env.REACT_APP_API_SERVER_URL

interface TechniqueDTO {
    title: string;
    videoSrc: string | null;
    description: string;
    globalNotes: string | null;
    gi: Gi;
    hierarchy: Hierarchy;
    type: {title: string, description: string};
    position: {title: string, description: string};
    openGuard: {title: string, description: string} | null;
    techniqueId: string
}

export const decodeAndAddRole = (userToken: Auth0User) =>  {
    if (!Object.values(Role).includes(userToken[`https://syllabustracker.matthewtapps.com/roles`][0])) {
        alert('Invalid user role attached to id token')
        return undefined
    }   

    const user = {
        ...userToken,
        role: userToken['https://syllabustracker.matthewtapps.com/roles'][0] as Role
    }

    return user
}

export const transformTechniqueForBackend = (technique: any): Technique | null => {
    if (!Object.values(Gi).includes(technique.gi)) {
        alert('Invalid Gi value');
        return null;
    }
  
    if (!Object.values(Hierarchy).includes(technique.hierarchy)) {
      alert('Invalid Hierarchy value');
        return null;
    }

    const transformedTechnique: TechniqueDTO = {
        title: technique.title,
        videoSrc: technique.videoSrc,
        description: technique.description,
        globalNotes: technique.globalNotes,
        gi: technique.gi as Gi,
        hierarchy: technique.hierarchy as Hierarchy,
        type: {
            title: technique.type,
            description: technique.typeDescription
        },
        position: {
            title: technique.position,
            description: technique.positionDescription
        },
        openGuard: null,
        techniqueId: ""
    };

    if (technique.openGuard && technique.openGuardDescription) {
        transformedTechnique.openGuard = {
            title: technique.openGuard,
            description: technique.openGuardDescription
        };
    }

    return transformedTechnique;
};

export const postTechnique = async (techniqueId: string | null, technique: Technique, accessToken: string | null): Promise<Technique | null> => {
    try {
        const response = await fetch(`${API_SERVER_URL}technique`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ technique, techniqueId }),
        });
  
        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }
  
        const responseData = await response.json();
        console.log('Success:', responseData);
        
        return responseData
        } catch (error) {
            console.error('Error:', error);
            alert(`Error posting technique: ${error}`);
            return null
        }
};

export const postCollectionTechniques = async (
    collectionId: string, 
    collectionTechniques: { index: number, technique: Technique }[],
    accessToken: string | null
    ) => {
    try {
        const response = await fetch(`${API_SERVER_URL}addToCollection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({collectionId: collectionId, techniques: collectionTechniques}),
        });
  
        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Success:', responseData);
        } catch (error) {
            console.error('Error:', error);
            alert(`Error posting collection: ${error}`);
        }
};

export const transformCollectionForBackend = (collection: any): CollectionWithoutTechniquesOrId | null => {
    if (!collection.title) {
        alert('Invalid title value')
        return null;
    }

    if (!collection.description) {
        alert('Invalid description value')
        return null;
    }

    if (collection.gi && !Object.values(Gi).includes(collection.gi)) {
        alert('Invalid Gi value');
        return null;
    }
  
    if (collection.hierarchy && !Object.values(Hierarchy).includes(collection.hierarchy)) {
      alert('Invalid Hierarchy value');
        return null;
    }
 
    const transformedCollection: CollectionWithoutTechniquesOrId = {
        title: collection.title,
        description: collection.description,
        globalNotes: collection.globalNotes || null,
        gi: collection.gi as Gi || null,
        hierarchy: collection.hierarchy as Hierarchy || null, 
        type: {
            title: collection.type,
            description: collection.typeDescription
        } || null,
        position: {
            title: collection.position,
            description: collection.positionDescription
        } || null,
        openGuard: {
            title: collection.openGuard,
            description: collection.openGuardDescription
        } || null,
    };

    if (collection.openGuard && collection.openGuardDescription) {
        transformedCollection.openGuard = {
            title: collection.openGuard,
            description: collection.openGuardDescription
        };
    }

    return transformedCollection;
};

  export const postCollection = async (
    collectionId: string | null, 
    collection: CollectionWithoutTechniquesOrId,
    accessToken: string | null
    ): Promise<Collection | null> => {
    if (!accessToken) {console.log(`Invalid access token on post Collection: ${accessToken}`); return null}
    try {
        const response = await fetch(`${API_SERVER_URL}newCollection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({collectionId: collectionId, collection: collection}),
        });
  
        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }
  
        const responseData = await response.json();
        return responseData
        } catch (error) {
            console.error('Error:', error);
            return null
        }
};

export const deleteCollection = async (collectionId: string, accessToken: string | null): Promise<number | null> => {
    if (!accessToken) {console.log(`Invalid access token on delete Collection: ${accessToken}`); return null}
    try {
        const response = await fetch(`${API_SERVER_URL}deleteCollection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({collectionId: collectionId}),
        });

    if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
    }

    const responseData = await response.json();
        console.log('Success:', responseData);
        return response.status
        } catch (error) {
            console.error('Error:', error);
            return null
        }
};

export const deleteTechnique = async (techniqueId: string, accessToken: string | null): Promise<number | null> => {
    if (!accessToken) {console.log(`Invalid access token on delete Technique: ${accessToken}`); return null}
    try {
        const response = await fetch(`${API_SERVER_URL}deleteTechnique`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({techniqueId: techniqueId}),
        });

    if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
    }

    const responseData = await response.json();
        console.log('Success:', responseData);
        return response.status
        } catch (error) {
            console.error('Error:', error);
            return null
        }
};

export const fetchCollections = async (accessToken: string | null) => {
    if (!accessToken) {console.log(`Invalid access token on fetch Collections: ${accessToken}`); return null}

    try {
        const [collectionResponse] = await Promise.all([
            fetch(`${API_SERVER_URL}collection`, { headers: { 'Authorization': `Bearer ${accessToken}` }})
        ]);

        const collections: Collection[] = await (collectionResponse.json())
        collections.sort((a, b) => a.title.localeCompare(b.title));

        return collections
    } catch (error) { console.log(`Error on fetch collections: ${error}`)}
};

export const fetchCollectionTechniques = async (accessToken: string | null) => {
    if (!accessToken) {console.log(`Invalid access token on fetch Collections: ${accessToken}`); return null}


    try {
        const [collectionTechniqueResponse] = await Promise.all([
            fetch(`${API_SERVER_URL}collectiontechnique`, { headers: { 'Authorization': `Bearer ${accessToken}` }})
        ]);

        const collectionTechniques: CollectionTechnique[] = await (collectionTechniqueResponse.json())

        return collectionTechniques
    } catch (error) { console.log(`Error on fetch collection techniques: ${error}`) }
};

export const fetchTechniques = async (accessToken: string | null) => {
    if (!accessToken) {console.log(`Invalid access token on fetch Techniques: ${accessToken}`); return null}

    try {
        const techniqueResponse = await fetch(`${API_SERVER_URL}technique`,
            { headers: { 'Authorization': `Bearer ${accessToken}` },
        
    })
        const techniques = (await techniqueResponse.json())
        
        return techniques
    } catch (error) { console.log(`Error on fetch techniques: ${error}`)}
};

export const fetchStudents = async (accessToken: string | null) => {
    if (!accessToken) {console.log(`Invalid access token on fetch Techniques: ${accessToken}`); return null}

    try {
        const studentsResponse = await fetch(`${API_SERVER_URL}students`,
        { headers: { 'Authorization': `Bearer ${accessToken}` }

    })
        const students = (await studentsResponse.json())

        return students
    } catch (error) { console.log(`Error on fetch students: ${error}`)}
};

export const stripAuth0FromUserId = (id: string): string => {
    return id.replace("auth0|", "")
};

export const addStudentTechniques = async (studentId: string, techniques: Technique[], accessToken: string | null): Promise<void> => {
    if (!accessToken) {
        console.error(`Invalid access token on add Student Techniques: ${accessToken}`);
        return;
    }

    try {
        const response = await fetch(`${API_SERVER_URL}student-techniques`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ studentId, techniques }),
        });

        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }

        console.log('Student Techniques added successfully');
    } catch (error) {
        console.error('Error:', error);
    }
};

export const updateStudentTechnique = async (studentId: string, techniqueId: string, updatedData: any, accessToken: string | null): Promise<void> => {
    if (!accessToken) {
        console.error(`Invalid access token on update Student Technique: ${accessToken}`);
        return;
    }

    try {
        const response = await fetch(`${API_SERVER_URL}student-technique/${studentId}/${techniqueId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }

        console.log('Student Technique updated successfully');
    } catch (error) {
        console.error('Error:', error);
    }
};

export const getStudentTechniques = async (studentId: string, accessToken: string | null): Promise<any> => {
    if (!accessToken) {
        console.error(`Invalid access token on fetch Student Techniques: ${accessToken}`);
        return;
    }

    try {
        const response = await fetch(`${API_SERVER_URL}student-technique/${studentId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }

        const studentTechniques = await response.json();
        return studentTechniques;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};
