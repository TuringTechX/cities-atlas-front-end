import {useEffect, useState} from 'react';
import {
  useGlobalIndustryMap,
} from '../../../../hooks/useGlobalIndustriesData';
import LAYOUT_DATA from './data/layout_data.json';
import {
  ClassificationNaicsIndustry,
} from '../../../../types/graphQL/graphQLTypes';
import {
  sectorColorMap,
} from '../../../../styling/styleUtils';

interface ContinentCluster {
  center: number[];
  color: string;
  id: number;
  name: string;
  polygon: number[][];
}

interface CountryCluster extends ContinentCluster {
  continent: number;
}

interface Clusters {
  continents: ContinentCluster[];
  countries: CountryCluster[];
}

interface Edge {
  trg: ClassificationNaicsIndustry['id'];
  proximity: number;
}

interface Node {
  id: ClassificationNaicsIndustry['id'];
  name: ClassificationNaicsIndustry['name'];
  code: ClassificationNaicsIndustry['code'];
  industryColor: string;
  sectorName: string;
  continent: number;
  country: number;
  edges: Edge[];
  x: number;
  y: number;
}

export interface LayoutData {
  clusters: Clusters;
  nodes: Node[];
}

interface Output {
  loading: boolean;
  error: any;
  data: LayoutData | undefined;
}

const useLayoutData = ():Output => {
  const [output, setOutput] = useState<Output>({
    loading: true,
    error: undefined,
    data: undefined,
  });

  const {loading, error, data: industryData} = useGlobalIndustryMap();

  useEffect(() => {
    if (!output.data) {
      if (error) {
        setOutput({loading: false, error, data: undefined});
      } else if (industryData && !loading) {
        const data: Output['data'] = {
          clusters: LAYOUT_DATA.clusters,
          nodes: LAYOUT_DATA.nodes.map(n => {
            const industry = industryData[n.id.toString()];
            const parent = industryData[industry.naicsIdTopParent.toString()];
            const parentIndustry = sectorColorMap.find(s => s.id === industry.naicsIdTopParent.toString());
            return {
              ...n,
              id: industry.naicsId,
              name: industry.name,
              code: industry.code,
              industryColor: parentIndustry ? parentIndustry.color : '#fff',
              sectorName: parent && parent.name ? parent.name : '',
              edges: n.edges.map(e => ({trg: e.trg.toString(), proximity: e.proximity})),
            };
          }),
        };
        setOutput({loading: false, error: undefined, data});
      }
    }
  }, [output, loading, error, industryData]);

  return output;
};

export default useLayoutData;

