import ShareButton from '../common-components/share-button';

type LandingPageHeaderProps = {
  onShareClicked: () => void;
  subtitle: string;
  title: string;
};

const LandingPageHeader = ({ onShareClicked, subtitle, title }: LandingPageHeaderProps) => {
  return (
    <div className="!flex !flex-col !gap-3">
      <div className="!flex !items-start !justify-between !gap-3">
        <p className="!m-0 !max-w-56 !text-base !leading-[1.35rem] !text-[color:var(--lp-text)]" style={{ fontFamily: 'Open Sans' }}>
          {title}
        </p>
        <div className="!mt-[-0.125rem] !inline-flex !items-center [&_.cds--btn--ghost]:!bg-transparent [&_.cds--btn--ghost:active]:!bg-transparent [&_.cds--btn--ghost:focus]:!bg-transparent [&_.cds--btn--ghost:hover]:!bg-transparent [&_.sidebar-worldview-shareIcon_svg]:!fill-[color:var(--lp-text)]">
          <ShareButton handleShareClicked={onShareClicked} shareButtonRef={null} />
        </div>
      </div>
      <p className="!m-0 !text-[0.8125rem] !font-normal !leading-[1.125rem] !tracking-[0.01rem] !text-[color:var(--lp-muted)]">
        {subtitle}
      </p>
    </div>
  );
};

export default LandingPageHeader;
