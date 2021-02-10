import {
  CityPartner,
} from '../../../types/graphQL/graphQLTypes';
import { useQuery, gql } from '@apollo/client';
import useCurrentCityId from '../../../hooks/useCurrentCityId';

const GET_SIMILAR_CITIES_PROXIMITY_QUERY = gql`
  query GetSimilarCities($cityId: Int) {
    cities: cityPartnerList (cityId: $cityId){
      cityId
      partnerId
      proximity
      id
    }
  }
`;

export interface SuccessResponse {
  cities: CityPartner[];
}

const useProximityData = () => {
  const cityId = useCurrentCityId();

  const response = useQuery<SuccessResponse, {cityId: number | null}>(GET_SIMILAR_CITIES_PROXIMITY_QUERY, {
    variables: {cityId: cityId ? parseInt(cityId, 10) : null},
  });
  return response;
};

export default useProximityData;