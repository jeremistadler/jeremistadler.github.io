
interface Chart {
  elm: d3.Selection<any>;
  width: number;
  height: number;
}

interface Timeline
{
  start: number;
  end: number;
  name: string;
}

interface TimelineChart extends Chart
{
  lines: Timeline[];
}


interface TextChart extends Chart
{
  text: string;
}


interface Datapoint {
  x: number;
  y: number;
}

interface Dataset {
  points: Datapoint[];
}

interface NamedDataset extends Dataset {
  name: string;
}


interface LineChart extends Chart
{
  start: number;
  end: number;
  smooth: boolean;
  lines: NamedDataset[];
}



interface LineSettings {
  header: string;
  elm: HTMLElement;
  lines: LineSettingsChart[];
}

interface LineSettingsChart {
  data: any;
  start: number;
  end: number;
}

interface ElasticDateAggregationRequest {
    start: number,
    end: number,
    selector: string,
    samples: number,
    groups: number,
}
