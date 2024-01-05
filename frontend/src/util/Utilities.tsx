import { Technique, Hierarchy, Gi, Collection, CollectionTechnique, Role, NewTechnique, UpdateTechnique, NewCollection, UpdateCollection, StudentTechnique } from "common";
import { User as Auth0User } from '@auth0/auth0-react'


const API_SERVER_URL = process.env.REACT_APP_API_SERVER_URL

export const decodeAndAddRole = (userToken: Auth0User) => {
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

export const transformTechniqueForPost = (technique: any): NewTechnique => {
    if (!Object.values(Gi).includes(technique.gi)) {
        throw new Error(`Invalid Gi value`)
    }

    if (!Object.values(Hierarchy).includes(technique.hierarchy)) {
        throw new Error(`Invalid Hierarchy value`)
    }

    let videos: {title: string, hyperlink: string}[] = []

    const videoKeys = Object.keys(technique).filter(key => key.startsWith("video"));
    const videoTitles = videoKeys.filter(key => key.includes("title"));

    videoTitles.forEach(titleKey => {
        const index = titleKey.split("_")[2]; // Assuming format video_title_0, video_title_1, etc.
        const linkKey = `video_link_${index}`;
        if ((technique[titleKey] && technique[linkKey]) && technique[titleKey].length > 0 && technique[linkKey].length > 0) {
            videos.push({ title: technique[titleKey], hyperlink: technique[linkKey] });
        }
    });

    const transformedTechnique: NewTechnique = {
        title: technique.title,
        videos: videos.length > 0 ? videos : null,
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
        openGuard: null
    };

    if (technique.openGuard && technique.openGuardDescription) {
        transformedTechnique.openGuard = {
            title: technique.openGuard,
            description: technique.openGuardDescription
        };
    }

    return transformedTechnique;
};

export const transformTechniqueForPut = (technique: any): UpdateTechnique => {
    if (!Object.values(Gi).includes(technique.gi)) {
        throw new Error(`Invalid Gi value`)
    }

    if (!Object.values(Hierarchy).includes(technique.hierarchy)) {
        throw new Error(`Invalid Hierarchy value`)
    }

    let videos: {title: string, hyperlink: string}[] = []

    const videoKeys = Object.keys(technique).filter(key => key.startsWith("video"));
    const videoTitles = videoKeys.filter(key => key.includes("title"));

    videoTitles.forEach(titleKey => {
        const index = titleKey.split("_")[2]; // Assuming format video_title_0, video_title_1, etc.
        const linkKey = `video_link_${index}`;
        if ((technique[titleKey] && technique[linkKey]) && technique[titleKey].length > 0 && technique[linkKey].length > 0) {
            videos.push({ title: technique[titleKey], hyperlink: technique[linkKey] });
        }
    });

    let transformedTechnique: UpdateTechnique = {
        techniqueId: technique.techniqueId,
        title: technique.title,
        videos: videos.length > 0 ? videos : null,
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
        openGuard: null
    };

    if (technique.openGuard && technique.openGuardDescription) {
        transformedTechnique.openGuard = {
            title: technique.openGuard,
            description: technique.openGuardDescription
        };
    }

    return transformedTechnique;
};

export const postTechnique = async (technique: NewTechnique, accessToken: string | null): Promise<Technique | null> => {
    try {
        const response = await fetch(`${API_SERVER_URL}technique`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ technique }),
        });
        if (!response.ok) { throw new Error(`Failed with status ${response.status}`); }
        const responseData = await response.json();
        return responseData
    } catch (error) { throw new Error(`Error posting technique: ${error}`) }
};

export const updateTechnique = async (technique: UpdateTechnique, accessToken: string | null): Promise<Technique | null> => {
    try {
        const response = await fetch(`${API_SERVER_URL}technique`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ technique }),
        });
        if (!response.ok) { throw new Error(`Failed with status ${response.status}`); }
        const responseData = await response.json();
        return responseData
    } catch (error) { throw new Error(`Error updating technique: ${error}`) }
};

export const postCollectionTechniques = async (
    collectionId: string,
    collectionTechniques: { index: number, technique: Technique }[],
    accessToken: string | null
): Promise<CollectionTechnique[]> => {
    try {
        const response = await fetch(`${API_SERVER_URL}collectiontechnique`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ collectionId: collectionId, techniques: collectionTechniques }),
        });
        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) { throw new Error(`Error posting collection techniques: ${error}`) }
};

export const transformCollectionForPost = (collection: any): NewCollection => {
    if (!collection.title) {
        throw new Error(`Collection title missing`)
    }

    if (!collection.description) {
        throw new Error(`Collection description missing`)
    }

    if (collection.gi && !Object.values(Gi).includes(collection.gi)) {
        throw new Error(`Gi value is invalid`)
    }

    if (collection.hierarchy && !Object.values(Hierarchy).includes(collection.hierarchy)) {
        throw new Error(`Hierarchy value is invalid`)
    }

    const transformedCollection: NewCollection = {
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

export const transformCollectionForPut = (collection: any): UpdateCollection => {
    if (!collection.title) {
        throw new Error(`Collection title missing`)
    }

    if (!collection.description) {
        throw new Error(`Collection description missing`)
    }

    if (collection.gi && !Object.values(Gi).includes(collection.gi)) {
        throw new Error(`Gi value is invalid`)
    }

    if (collection.hierarchy && !Object.values(Hierarchy).includes(collection.hierarchy)) {
        throw new Error(`Hierarchy value is invalid`)
    }

    const transformedCollection: UpdateCollection = {
        collectionId: collection.collectionId,
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
    collection: NewCollection,
    accessToken: string | null
): Promise<Collection | null> => {
    if (!accessToken) { console.log(`Invalid access token on post Collection: ${accessToken}`); return null }
    try {
        const response = await fetch(`${API_SERVER_URL}collection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ collection: collection }),
        });

        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }

        const responseData = await response.json();

        return responseData
    } catch (error) { throw new Error(`Error posting collection: ${error}`) }
};

export const updateCollection = async (
    collection: UpdateCollection,
    accessToken: string | null
): Promise<Collection> => {
    if (!accessToken) { throw new Error(`Invalid access token on update Collection`) }
    try {
        const response = await fetch(`${API_SERVER_URL}collection`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ collection: collection }),
        });
        if (!response.ok) { throw new Error(`Failed with status ${response.status}`); }
        const responseData = await response.json();
        return responseData
    } catch (error) { throw new Error(`Error updating collection: ${error}`) }
};

export const deleteCollection = async (collectionId: string, accessToken: string | null): Promise<number> => {
    if (!accessToken) { throw new Error(`Invalid access token on update Collection`) }
    try {
        const response = await fetch(`${API_SERVER_URL}collection`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ collectionId: collectionId }),
        });
        if (!response.ok) { throw new Error(`Failed with status ${response.status}`); }
        return await response.json();
    } catch (error) { throw new Error(`Error deleting collection: ${error}`) }
};

export const deleteTechnique = async (techniqueId: string, accessToken: string | null): Promise<number> => {
    if (!accessToken) { throw new Error(`Invalid access token on delete technique`) }
    try {
        const response = await fetch(`${API_SERVER_URL}technique`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ techniqueId: techniqueId }),
        });

        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) { throw new Error(`Error deleting technique: ${error}`) }
};

export const fetchCollections = async (accessToken: string | null): Promise<Collection[]> => {
    if (!accessToken) throw new Error(`Access token invalid on fetch collections`)

    try {
        const [collectionResponse] = await Promise.all([
            fetch(`${API_SERVER_URL}collection`, { headers: { 'Authorization': `Bearer ${accessToken}` } })
        ]);

        const collections: Collection[] = await (collectionResponse.json())

        return collections
    } catch (error) { throw new Error(`Error on fetch collections: ${error}`) }
};

export const fetchCollectionTechniques = async (accessToken: string | null): Promise<CollectionTechnique[]> => {
    if (!accessToken) throw new Error(`Access token error on fetch collection techniques`)

    try {
        const [collectionTechniqueResponse] = await Promise.all([
            fetch(`${API_SERVER_URL}collectiontechnique`, { headers: { 'Authorization': `Bearer ${accessToken}` } })
        ]);

        const collectionTechniques: CollectionTechnique[] = await (collectionTechniqueResponse.json())

        return collectionTechniques
    } catch (error) { throw new Error(`Error on fetch collection techniques: ${error}`) }
};

export const fetchTechniques = async (accessToken: string | null): Promise<Technique[]> => {
    if (!accessToken) throw new Error(`Access token error on fetch techniques`)

    try {
        const techniqueResponse = await fetch(`${API_SERVER_URL}technique`,
            {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            })
        const techniques = (await techniqueResponse.json())

        return techniques
    } catch (error) { throw new Error(`Failed to fetch techniques: ${error}`) }
};

export const fetchStudents = async (accessToken: string | null) => {
    if (!accessToken) { throw new Error(`Invalid access token on fetch Techniques: ${accessToken}`); }
    try {
        const studentsResponse = await fetch(`${API_SERVER_URL}students`,
            {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })
        const students = (await studentsResponse.json())

        return students
    } catch (error) { throw new Error(`Error on fetch students: ${error}`) }
};

export const stripAuth0FromUserId = (id: string): string => {
    return id.replace("auth0|", "")
};

export const postStudentTechniques = async (studentId: string, techniques: Technique[], accessToken: string | null): Promise<StudentTechnique[]> => {
    if (!accessToken) { throw new Error(`Invalid access token on add Student Techniques: ${accessToken}`); }
    try {
        const response = await fetch(`${API_SERVER_URL}studenttechnique`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ studentId, techniques }),
        });

        if (!response.ok) { throw new Error(`Failed with status ${response.status}`); }
        return await response.json()
    } catch (error) { throw new Error(`Error:, ${error}`); }
};

export const updateStudentTechnique = async (studentId: string, techniqueId: string, updatedData: Partial<StudentTechnique>, accessToken: string | null): Promise<StudentTechnique> => {
    if (!accessToken) { throw new Error(`Invalid access token on update Student Technique: ${accessToken}`); }
    try {
        const response = await fetch(`${API_SERVER_URL}studenttechnique/${studentId}/${techniqueId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({studentId, techniqueId, updatedData}),
        });
        if (!response.ok) { throw new Error(`Failed with status ${response.status}`); }
        return await response.json()
    } catch (error) { throw new Error(`Error:, ${error}`); }
};

export const fetchStudentTechniques = async (studentId: string, accessToken: string | null): Promise<StudentTechnique[]> => {
    if (!accessToken) { throw new Error(`Invalid access token on fetch Student Technique: ${accessToken}`); }
    try {
        const response = await fetch(`${API_SERVER_URL}studenttechnique/${studentId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }

        const studentTechniques = await response.json();
        return studentTechniques;
    } catch (error) { throw new Error(`Error:, ${error}`); }
};

export const deleteStudentTechnique = async (studentTechniqueId: string, accessToken: string | null): Promise<number> => {
    if (!accessToken) { throw new Error(`Invalid access token on delete technique`) }
    try {
        const response = await fetch(`${API_SERVER_URL}studenttechnique`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ studentTechniqueId: studentTechniqueId }),
        });

        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }
        return response.status;
    } catch (error) { throw new Error(`Error deleting student technique: ${error}`) }
};

export const fetchPositions = async (accessToken: string | null): Promise<{ title: string, description: string }[]> => {
    if (!accessToken) { throw new Error(`Invalid access token on fetch positions: ${accessToken}`); }
    try {
        const response = await fetch(`${API_SERVER_URL}position`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) { throw new Error(`Failed with status ${response.status}`); }
        const positions = await response.json();
        return positions;
    } catch (error) { throw new Error(`Error: ${error}`) }
};

export const fetchTypes = async (accessToken: string | null): Promise<{ title: string, description: string }[]> => {
    if (!accessToken) { throw new Error(`Invalid access token on fetch types: ${accessToken}`); }
    try {
        const response = await fetch(`${API_SERVER_URL}type`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) { throw new Error(`Failed with status ${response.status}`); }
        const positions = await response.json();
        return positions;
    } catch (error) { throw new Error(`Error: ${error}`) }
};

export const fetchOpenGuards = async (accessToken: string | null): Promise<{ title: string, description: string }[]> => {
    if (!accessToken) { throw new Error(`Invalid access token on fetch open guards: ${accessToken}`); }
    try {
        const response = await fetch(`${API_SERVER_URL}openguard`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) { throw new Error(`Failed with status ${response.status}`); }
        const positions = await response.json();
        return positions;
    } catch (error) { throw new Error(`Error: ${error}`) }
};
