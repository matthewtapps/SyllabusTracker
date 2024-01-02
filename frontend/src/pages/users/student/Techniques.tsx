import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { StudentTechniqueListWithFilters } from '../../../components/Lists/StudentTechniquesListWithFilters'
import { setAccessToken } from '../../../slices/auth'
import { AppDispatch } from '../../../store/store'


function StudentTechniques(): JSX.Element {
    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                dispatch(setAccessToken(token))

            } catch (error) {
                console.log(error);
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently, dispatch]);

    return (
        <StudentTechniqueListWithFilters/>
    );
};

export default StudentTechniques
