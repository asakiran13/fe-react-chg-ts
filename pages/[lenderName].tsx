import { DatePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterLuxon';
import {
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import fields from 'constants/fields';
import lenders from 'constants/lenders';
import { SERVER_URL } from 'constants/urls';
import {
  FieldType,
  LenderFields,
  LenderGetResponse,
  LenderGetResponseExtended,
} from 'lib/types';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import swal from 'sweetalert';

type SubmitDecision = 'accepted' | 'declined';
type FormData = Record<FieldType, string | number | boolean>;

const LenderNamePage: NextPage<{ data: LenderGetResponseExtended }> = ({
  data,
}) => {
  const router = useRouter();
  const defaultValues = data.fields.reduce((acc, field) => {
    acc[field.name] =
      field.type === 'checkbox'
        ? true
        : field.type === 'date'
        ? new Date().toISOString().substr(0, 10)
        : '';
    return acc;
  }, {} as FormData);
  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isValid },
  } = useForm<FormData>({ mode: 'all', reValidateMode: 'onChange' });

  const lenderSlug = router.query.lenderName?.toString();

  const onSubmit = (data: FormData) => {
    axios
      .post(`${SERVER_URL}/lenders/${lenderSlug}`, data)
      .then((res: { data: { decision: SubmitDecision } }) => {
        const decision = res.data.decision;
        if (decision === 'accepted') {
          swal({
            title: 'Accepted',
            text: 'Your application has been accepted',
            icon: 'success',
          }).then(() => {
            reset(defaultValues, {
              keepValues: false,
            });
          });
        } else if (decision === 'declined') {
          swal({
            title: 'Declined',
            text: 'Your application has been declined for some reason',
            icon: 'error',
          }).then(() => {
            reset(defaultValues, {
              keepValues: false,
            });
          });
        }
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container justifyContent="center" spacing={3}>
        <Grid item xs={12}>
          <h2 style={{ textAlign: 'center' }}> {data.name} </h2>
        </Grid>
        <Grid container xs={12} lg={8} spacing={3} style={FormComponent}>
          {data.fields.map((fieldObj: LenderFields) => {
            const { required, name, options } = fieldObj;
            const label = name
              .split('_')
              .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
              .join(' ');
            return (
              <Grid key={name} item xs={12} lg={6}>
                {(() => {
                  switch (fieldObj.type) {
                    case 'text':
                      return (
                        <Controller
                          name={name}
                          defaultValue={''}
                          control={control}
                          rules={{ required: `${label} required` }}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              label={label}
                              {...field}
                              style={FormFieldComponent}
                              required={required}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                      );
                    case 'select':
                      return (
                        <Controller
                          name={name}
                          control={control}
                          rules={{ required: `${label} required` }}
                          defaultValue={''}
                          render={({ field }) => (
                            <div>
                              <InputLabel style={FormFieldComponent}>
                                {label}
                              </InputLabel>
                              <Select
                                label={label}
                                {...field}
                                style={FormFieldComponent}
                                required={required}
                              >
                                {options?.map((opt) => (
                                  <MenuItem value={opt}>{opt}</MenuItem>
                                ))}
                              </Select>
                            </div>
                          )}
                        />
                      );
                    case 'checkbox':
                      return (
                        <Controller
                          name={name}
                          control={control}
                          rules={{ required: `${label} required` }}
                          defaultValue={true}
                          render={({ field }) => (
                            <div
                              style={{
                                ...FormFieldComponent,
                                paddingTop: '5%',
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    required={required}
                                    defaultChecked
                                    {...field}
                                  />
                                }
                                label={label}
                              />
                            </div>
                          )}
                        />
                      );
                    case 'date':
                      return (
                        <Controller
                          name={name}
                          defaultValue={new Date().toISOString().substr(0, 10)}
                          control={control}
                          rules={{ required: `${label} required` }}
                          render={({ field, fieldState: { error } }) => (
                            <LocalizationProvider dateAdapter={DateAdapter}>
                              <DatePicker
                                {...field}
                                label={label}
                                renderInput={(params) => (
                                  <TextField
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                    {...params}
                                    style={FormFieldComponent}
                                    required={required}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                      );
                    case 'number':
                      return (
                        <Controller
                          name={name}
                          control={control}
                          rules={{ required: `${label} required` }}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              error={!!error}
                              helperText={error ? error.message : null}
                              type="number"
                              label={label}
                              {...field}
                              style={FormFieldComponent}
                              required={required}
                            />
                          )}
                        />
                      );
                  }
                })()}
              </Grid>
            );
          })}
          <Grid container xs={12} justifyContent="center" margin={2}>
            <Grid item xs={6} lg={1.5}>
              <Button
                variant="contained"
                type="submit"
                disabled={!isDirty || !isValid}
                fullWidth
              >
                {' '}
                Submit{' '}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default LenderNamePage;

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await fetch(
    `${SERVER_URL}/lenders/${context.params?.lenderName?.toString()}`,
  );
  let data: LenderGetResponse | LenderGetResponseExtended = await res.json();
  if (!data) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      data: {
        ...data,
        fields: data.fields.map((field) =>
          typeof field === 'string'
            ? fields[field]
            : { ...fields[field.name], ...field },
        ),
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the paths we want to pre-render based on users
  const paths = lenders.map((lender) => ({
    params: { lenderName: lender.slug },
  }));
  return { paths, fallback: false };
};

const FormComponent: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
};

const FormFieldComponent: React.CSSProperties = {
  width: '75%',
  marginLeft: '10%',
};
