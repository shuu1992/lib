import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// i18n
import zhTW from '@i18n/zh-TW';
import zhCN from '@i18n/zh-CN';
import vi from '@i18n/vi';
import en from '@i18n/en';
// custom Components
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

type NestedObject = Record<string, any>;
type CompareResult = {
  missing: NestedObject;
  extra: NestedObject;
};

const RDi18n = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
  const { t } = usePage();
  const [defaultLang, setDefaultLang] = useState(zhTW);
  const [langList, setLangList] = useState([
    {
      lang: 'zh_CN',
      data: zhCN,
    },
    {
      lang: 'vi',
      data: vi,
    },
    {
      lang: 'en',
      data: en,
    },
  ]);
  function compareObjects(obj1: NestedObject, obj2: NestedObject): CompareResult {
    const missingKeys: NestedObject = {};
    const extraKeys: NestedObject = {};

    // Find keys missing in obj2
    Object.keys(obj1).forEach((key) => {
      if (!(key in obj2)) {
        missingKeys[key] = obj1[key];
      } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        const result = compareObjects(obj1[key], obj2[key]);
        if (Object.keys(result.missing).length > 0) {
          missingKeys[key] = result.missing;
        }
        if (Object.keys(result.extra).length > 0) {
          extraKeys[key] = result.extra;
        }
      }
    });

    // Find keys extra in obj2
    Object.keys(obj2).forEach((key) => {
      if (!(key in obj1)) {
        extraKeys[key] = obj2[key];
      } // Nested objects are already checked above
    });

    return { missing: missingKeys, extra: extraKeys };
  }

  const [compareObj, setCompareObj] = useState<Record<string, CompareResult>>({});
  useEffect(() => {
    langList.forEach((item) => {
      const result = compareObjects(defaultLang, item.data);
      setCompareObj((prev) => ({ ...prev, [item.lang]: result }));
    });
  }, []);

  return (
    <Grid container>
      <Grid xs={12}>
        <h1>Compare i18n</h1>
      </Grid>
      {Object.keys(langList).map((item, key) => {
        const lang = langList[item as any].lang;
        return (
          <Grid xs={12} key={key}>
            <Grid xs={12}>
              <h2>{t(`lang.${lang}`)}</h2>
            </Grid>
            <Grid xs={12} key={`miss.${key}`}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Miss</AccordionSummary>
                <AccordionDetails>
                  <JsonView
                    data={compareObj[lang]?.missing}
                    shouldExpandNode={allExpanded}
                    style={defaultStyles}
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid xs={12} key={`extra.${key}`}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Extra</AccordionSummary>
                <AccordionDetails>
                  <JsonView
                    data={compareObj[lang]?.extra}
                    shouldExpandNode={allExpanded}
                    style={defaultStyles}
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        );
      })}
      {/* <Grid xs={12}>
        <h2>zhTW</h2>
      </Grid>
      <Grid xs={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Extra</AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </Accordion>
      </Grid> */}
    </Grid>
  );
};

export default withPageHoc(RDi18n);
