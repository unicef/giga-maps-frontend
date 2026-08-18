import { useStore } from 'effector-react';
import { ArrowRight } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import useForm from '~/lib/hooks/useForm';

import { CONTACT_COPY, CONTACT_PURPOSES } from '../landing.constant';
import { $isContactSending, submitContactFx } from '../landing.model';

const defaultFields = {
  email: '',
  full_name: '',
  message: '',
  organisation: '',
  purpose: '',
};

const validationRules = {
  email: [
    { message: CONTACT_COPY.emailRequired, required: true },
    {
      message: CONTACT_COPY.emailInvalid,
      validate: (value: string) =>
        !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    },
  ],
  full_name: [{ message: CONTACT_COPY.fullNameRequired, required: true }],
  message: [{ message: CONTACT_COPY.messageRequired, required: true }],
  organisation: [
    { message: CONTACT_COPY.organisationRequired, required: true },
  ],
  purpose: [{ message: CONTACT_COPY.purposeRequired, required: true }],
};

const FIELD_LABEL = 'mb-2! block! text-sm! text-muted-foreground!';
const FIELD_ERROR = 'mt-2! mb-0! text-sm! text-destructive!';
// Filled box with a single bottom rule, matching the /about dialog.
const FIELD_BOX =
  'h-12! w-full! rounded-none! border-0! border-b! border-border! bg-muted! px-4! text-base! text-foreground! placeholder:text-muted-foreground! focus-visible:border-primary! focus-visible:ring-0!';

interface GetInTouchDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const GetInTouchDialog = ({
  onOpenChange,
  open,
}: GetInTouchDialogProps) => {
  const isSending = useStore($isContactSending);
  const [hasFailed, setHasFailed] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    reset,
    touched,
    values,
  } = useForm(defaultFields, validationRules);

  useEffect(() => {
    reset();
    setHasFailed(false);
    setHasSubmitted(false);
    // `reset` is rebuilt on every render, so keying on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Also after a submit attempt: showing errors only for visited fields means
  // pressing Send on an empty form looks like nothing happened.
  const errorFor = (name: keyof typeof defaultFields) =>
    (touched[name] || hasSubmitted) && errors[name] ? errors[name] : '';

  const submit = handleSubmit((data) => {
    setHasFailed(false);
    void submitContactFx(data as Record<string, string>)
      .then(() => onOpenChange(false))
      .catch(() => setHasFailed(true));
  });

  const onSubmit = (event: FormEvent) => {
    setHasSubmitted(true);
    submit(event);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex! max-h-[90dvh]! flex-col! gap-0! overflow-hidden! border-border! bg-background! p-0! text-foreground! tablet:max-w-2xl!">
        <DialogHeader className="border-b! border-border! px-6! py-5!">
          <DialogTitle className="text-center! font-manrope! text-2xl! font-medium!">
            {CONTACT_COPY.title}
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex! min-h-0! flex-1! flex-col!"
          noValidate={true}
          onSubmit={onSubmit}
        >
          <div className="flex! min-h-0! flex-1! flex-col! gap-6! overflow-y-auto! px-6! py-6!">
            <DialogDescription className="m-0! text-base! text-foreground!">
              {CONTACT_COPY.intro}
            </DialogDescription>
            <div>
              <Label className={FIELD_LABEL} htmlFor="contact-full-name">
                {CONTACT_COPY.fullName}
              </Label>
              <Input
                className={FIELD_BOX}
                id="contact-full-name"
                name="full_name"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder={CONTACT_COPY.fullNamePlaceholder}
                value={values.full_name}
              />
              {errorFor('full_name') ? (
                <p className={FIELD_ERROR}>{errorFor('full_name')}</p>
              ) : null}
            </div>

            <div>
              <Label className={FIELD_LABEL} htmlFor="contact-email">
                {CONTACT_COPY.email}
              </Label>
              <Input
                className={FIELD_BOX}
                id="contact-email"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder={CONTACT_COPY.emailPlaceholder}
                type="email"
                value={values.email}
              />
              {errorFor('email') ? (
                <p className={FIELD_ERROR}>{errorFor('email')}</p>
              ) : null}
            </div>

            <div>
              <Label className={FIELD_LABEL} htmlFor="contact-organisation">
                {CONTACT_COPY.organisation}
              </Label>
              <Input
                className={FIELD_BOX}
                id="contact-organisation"
                name="organisation"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder={CONTACT_COPY.organisationPlaceholder}
                value={values.organisation}
              />
              {errorFor('organisation') ? (
                <p className={FIELD_ERROR}>{errorFor('organisation')}</p>
              ) : null}
            </div>

            <div>
              <Label className={FIELD_LABEL} htmlFor="contact-purpose">
                {CONTACT_COPY.purpose}
              </Label>
              {/* Radix reports the value, not a DOM event, so it is adapted to
                the shape useForm expects. */}
              <Select
                onValueChange={(value) => {
                  handleChange({
                    target: { name: 'purpose', value },
                  } as ChangeEvent<HTMLInputElement>);
                  handleBlur({ target: { name: 'purpose' } });
                }}
                value={values.purpose}
              >
                <SelectTrigger
                  className={`${FIELD_BOX} w-full! cursor-pointer!`}
                  id="contact-purpose"
                >
                  <SelectValue placeholder={CONTACT_COPY.purposePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_PURPOSES.map((purpose) => (
                    <SelectItem
                      className="cursor-pointer!"
                      key={purpose}
                      value={purpose}
                    >
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorFor('purpose') ? (
                <p className={FIELD_ERROR}>{errorFor('purpose')}</p>
              ) : null}
            </div>

            <div>
              <Label className={FIELD_LABEL} htmlFor="contact-message">
                {CONTACT_COPY.message}
              </Label>
              <Textarea
                className={FIELD_BOX}
                id="contact-message"
                name="message"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder={CONTACT_COPY.messagePlaceholder}
                rows={5}
                value={values.message}
              />
              {errorFor('message') ? (
                <p className={FIELD_ERROR}>{errorFor('message')}</p>
              ) : null}
            </div>

            {hasFailed ? (
              <p className={FIELD_ERROR} role="alert">
                {CONTACT_COPY.failed}
              </p>
            ) : null}
          </div>

          <DialogFooter className="mt-0! shrink-0! p-0!">
            <Button
              className="h-14! w-full! cursor-pointer! justify-between! rounded-none! bg-primary! px-6! text-base! font-medium! text-primary-foreground! hover:bg-primary/90!"
              disabled={isSending}
              type="submit"
            >
              {isSending ? CONTACT_COPY.sending : CONTACT_COPY.send}
              <ArrowRight aria-hidden="true" className="size-5" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
