import React from 'react';
import * as classNames from 'classnames';
import { Brand, Card, CardHeader, CardTitle, CardBody, Tooltip } from '@patternfly/react-core';
import { ODHAppType } from '../types';

import './OdhCard.scss';

type OdhExploreCardProps = {
  odhApp: ODHAppType;
  isSelected: boolean;
  onSelect: () => void;
};

const OdhExploreCard: React.FC<OdhExploreCardProps> = ({ odhApp, isSelected, onSelect }) => {
  const cardClasses = classNames('odh-card', { 'm-disabled': odhApp.spec.comingSoon });
  const badgeClasses = classNames('odh-card__partner-badge', {
    'm-warning': odhApp.spec.category === 'Third party support',
    'm-hidden': odhApp.spec.category === 'Red Hat',
  });
  const supportedImageClasses = classNames('odh-card__supported-image', {
    'm-hidden': odhApp.spec.category !== 'Red Hat',
  });

  return (
    <Card
      isHoverable={!odhApp.spec.comingSoon}
      isSelectable={!odhApp.spec.comingSoon}
      isSelected={isSelected}
      className={cardClasses}
      onClick={() => !odhApp.spec.comingSoon && onSelect()}
    >
      <CardHeader>
        <Brand
          className="odh-card__header-brand"
          src={odhApp.spec.img}
          alt={odhApp.spec.displayName}
        />
        {odhApp.spec.comingSoon ? <span className="odh-card__coming-soon">Coming soon</span> : null}
        {!odhApp.spec.comingSoon && odhApp.spec.category ? (
          <span className={badgeClasses}>{odhApp.spec.category}</span>
        ) : null}
      </CardHeader>
      <CardTitle>
        {odhApp.spec.displayName}
        <Tooltip content="Red Hat Certified and Supported">
          <img
            className={supportedImageClasses}
            src="../images/CheckStar.svg"
            alt="Red Hat Certified and Supported"
          />
        </Tooltip>
        {odhApp.spec.provider ? (
          <div>
            <span className="odh-card__provider">by {odhApp.spec.provider}</span>
          </div>
        ) : null}
      </CardTitle>
      <CardBody>{odhApp.spec.description}</CardBody>
    </Card>
  );
};

export default OdhExploreCard;
