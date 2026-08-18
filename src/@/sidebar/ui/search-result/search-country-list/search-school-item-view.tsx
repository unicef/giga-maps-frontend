import { createEvent, restore } from 'effector';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '~/components/ui/checkbox';
import { timeoutStore } from '~/lib/effector-kit';

import { MAX_SCHOOL_SELECTED } from '../container/search-result.constant';
import {
  $searchSchoolIds,
  setSchoolSelection,
} from '../container/search-result.model';
import { SearchResultApi } from '../container/search-result.type';

export const setShowMessage = createEvent<number>();
const $showMessage = restore(setShowMessage, 0);

// reset store after 4 secs
timeoutStore({
  clock: setShowMessage,
  target: setShowMessage,
  resetState: 0,
  timeout: 4000,
});

export const SearchSchool = ({ school }: { school: SearchResultApi }) => {
  const { id, external_id: externalId, name } = school;
  const showMessage = useStore($showMessage) === id;
  const selectedSchool = useStore($searchSchoolIds);
  const schoolId = id.toString();
  const isChecked = selectedSchool.has(schoolId);
  const maxSchoolSelected = selectedSchool.size >= MAX_SCHOOL_SELECTED;
  const { t } = useTranslation();

  const toggleSelection = () => {
    if (maxSchoolSelected && !isChecked) {
      setShowMessage(id);
      return;
    }
    setShowMessage(0);
    setSchoolSelection([school, isChecked]);
  };

  return (
    <div>
      <label
        className="flex! cursor-pointer! items-center! gap-2!"
        htmlFor={schoolId}
      >
        <Checkbox
          checked={isChecked}
          className="size-4! shrink-0! rounded-sm! border! border-foreground! bg-transparent! shadow-none! data-[state=checked]:border-foreground! data-[state=checked]:bg-foreground! data-[state=checked]:text-background! [&_svg]:size-3!"
          data-testid="single-school"
          id={schoolId}
          onCheckedChange={toggleSelection}
        />
        <div className="flex! min-w-0! flex-col!">
          <span className="truncate! text-sm! font-normal! text-foreground! capitalize!">
            {name?.toLowerCase()}
          </span>
          <span className="text-2xs! font-normal! text-on-surface-subtle!">
            {externalId}
          </span>
        </div>
      </label>
      {showMessage && (
        <div
          className="mt-2! rounded-sm! border-l-2! border-warning! bg-warning/10! px-3! py-2! text-xs! text-foreground!"
          role="alert"
        >
          {t('maximum-school-selection-allowed', {
            maxSchools: MAX_SCHOOL_SELECTED,
          })}
        </div>
      )}
    </div>
  );
};
