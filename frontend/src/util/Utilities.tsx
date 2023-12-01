import { Technique, Hierarchy, Gi, Collection, CollectionTechnique, CollectionWithoutTechniquesOrId } from "common";


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

export const postTechnique = async (techniqueId: string | null, technique: Technique): Promise<Technique | null> => {
    try {
        const response = await fetch('http://192.168.0.156:3000/api/technique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({technique: technique, techniqueId: techniqueId}),
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

export const postCollectionTechniques = async (collectionId: string, collectionTechniques: { index: number, technique: Technique }[]) => {
    try {
        const response = await fetch('http://192.168.0.156:3000/api/addToCollection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

  export const postCollection = async (collectionId: string | null, collection: CollectionWithoutTechniquesOrId): Promise<Collection | null> => {
    try {
        const response = await fetch('http://192.168.0.156:3000/api/newCollection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            alert(`Error posting collection: ${error}`);
            return null
        }
};

export const deleteCollection = async (collectionId: string): Promise<number | null> => {
    try {
        const response = await fetch('http://192.168.0.156:3000/api/deleteCollection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            alert(`Error deleting collection: ${error}`);
            return null
        }
}

export const deleteTechnique = async (techniqueId: string): Promise<number | null> => {
    try {
        const response = await fetch('http://192.168.0.156:3000/api/deleteTechnique', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            alert(`Error deleting technique: ${error}`);
            return null
        }
}