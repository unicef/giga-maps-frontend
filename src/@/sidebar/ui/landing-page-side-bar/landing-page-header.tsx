import ShareButton from '../common-components/share-button';

type LandingPageHeaderProps = {
  onShareClicked: () => void;
  subtitle: string;
  title: string;
};

const LandingPageHeader = ({ onShareClicked, subtitle, title }: LandingPageHeaderProps) => {
  return (
    <div className="flex! flex-col! gap-3!">
      <div className="flex! items-start! justify-between! gap-3!">
        <p className="m-0! max-w-56! text-2xl! font-light! leading-7.5! text-(--lp-text)!">
          {title}
        </p>
        <div className="-mt-0.5! inline-flex! items-center! [&_.cds--btn--ghost]:bg-transparent! [&_.cds--btn--ghost:active]:bg-transparent! [&_.cds--btn--ghost:focus]:bg-transparent! [&_.cds--btn--ghost:hover]:bg-transparent! [&_.sidebar-worldview-shareIcon_svg]:fill-(--lp-text)!">
          <ShareButton handleShareClicked={onShareClicked} shareButtonRef={null} />
        </div>
      </div>
      <p className="m-0! text-xs! font-normal! leading-4.5! tracking-[0.01rem]! text-(--lp-muted)!">
        {subtitle}
      </p>
    </div>
  );
};

export default LandingPageHeader;
