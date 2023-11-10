import { Technique, Hierarchy, Gi } from "common";

export const transformTechniqueForBackend = (technique: any): Technique | null => {
    if (!Object.values(Gi).includes(technique.gi)) {
        alert('Invalid Gi value');
        return null;
    }
  
    if (!Object.values(Hierarchy).includes(technique.hierarchy)) {
      alert('Invalid Hierarchy value');
        return null;
    }

    return {
        ...technique,
        gi: technique.gi as Gi,
        hierarchy: technique.hierarchy as Hierarchy,
    };
}

export const postTechnique = async (techniqueId: string | null, technique: Technique) => {
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
        
        return response.status
        } catch (error) {
            console.error('Error:', error);
            alert(`Error posting technique: ${error}`);
            return error
        }
};
